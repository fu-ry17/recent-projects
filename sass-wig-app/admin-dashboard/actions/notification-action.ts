"use server"

import prismadb from "@/lib/prisma";
import { INotification } from "@/types/types";
import { sendNotification } from "@/utils/sendNotification";
import { auth } from "@clerk/nextjs";
import { Store } from "@prisma/client";
import DeviceDetector from "device-detector-js";
import { headers } from "next/headers";


export const subscribeToPushNotifications = async(storeId: string, subscription: string ) => {
    const deviceDetector = new DeviceDetector();
    const userAgent = headers().get("user-agent") || ''
    const device = deviceDetector.parse(userAgent);

    const { userId } = auth()

    if(!userId || !storeId) return { error: "An error occured"}
    
    // optional
    const store = await prismadb.store.findFirst({ where: { userId }})
    if(!store) return { error: "no store was found!"}

    const deviceInfo = JSON.stringify(device)
 
    try {
        const data: INotification = { title: store.name, message: `You have subscribed to ${store.name} push notifications` }
          // add to database with user and storeId
        await prismadb.pushNotifications.create({ data: {
            device: deviceInfo, pushSub: subscription, userId, role: store?.userId === userId ? "admin" : "user", storeId
        }})
        // send push notification
        await sendNotification(subscription, data)

        return { success: 'web push subscribed'}

    } catch (error) {
        if(error instanceof Error){
          return { error: "An error occured, could not subscribe, try again"}
        }
    }  
}

export const adminNotifications = async (store: Store, message: string) => {
  try {
    const pubsubs = await prismadb.pushNotifications.findMany({
      where: { role: "admin", storeId: store.id }
    })

    if (pubsubs) {
      await Promise.all(pubsubs.map(async p => {
        const data: INotification = { title: store.name, message }
        await sendNotification(p.pushSub, data);
      }))
    }

    return 
    
  } catch (error: any) {
    console.log(`ADM_PUSH_ERROR`, error.message);
    if (error instanceof Error) {
      return { error: "An error occurred, could not send admin notifications" }
    }
    return { error: "An unexpected error occurred" }
  }
}
