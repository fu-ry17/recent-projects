"use server"

import { getMonth } from "@/lib/dataArr"
import prismadb from "@/lib/prisma"
import { orderSchema } from "@/lib/schema"
import { formatter } from "@/lib/utils"
import { ResponseObject } from "@/types/types"
import { statusSheetAppointment } from "@/utils/sheetAppointments"
import { createSheetOrders, deleteSheetOrder, updateSheetOrder } from "@/utils/sheetOrders"
import { auth } from "@clerk/nextjs"
import { format } from "date-fns"
import _ from "lodash"
import * as z from "zod"
import { deleteAppointment } from "./appointment-actions"
import { adminNotifications } from "./notification-action"

export const getOrders = async(storeId: string, searchParams: any) => {
  try {
    //searchParams
    const monthSearch = searchParams.month || ''
    const sort = searchParams.sort || 'desc'
    const status = searchParams.status

    const month = getMonth()
    const year = new Date().getFullYear()

    type Clause = { storeId: string, month: string, year: number, status?: string }

    const whereClause: Clause = {
      storeId, month: monthSearch ? monthSearch : month, year
    };
    
    if (status) { whereClause.status = status }
  
    const orders = await prismadb.order.findMany({ 
        where: whereClause,
        include: { orderCategories: true },
        orderBy: { createdAt: sort }
    })
 
    const formattedOrders = orders.map(o => ({
       id: o.id,
       name: o.name,
       unit: o.unit as string,
       amountPaid: formatter.format(o.amountPaid.toNumber()).toLowerCase(), 
       category: o.orderCategories.map(o => o.name).join(", "),
       status: o.status, 
       balance: formatter.format(o.balance.toNumber()).toLowerCase(),
       createdAt: format(o.createdAt, "M/d/y"),
    }))
 
    return formattedOrders 

  } catch (error) {
    return []
  }
}

export const getOrder = async(orderId: string, storeId: string ) => {
    try {
        const data = await prismadb.order.findFirst({
             where: { id: orderId, storeId },
             include: { appointment: true, orderCategories: true, store: true }
        })

        const order = _.omit(data, ['orderCategories', 'appointment', 'store'])

        if(!data) return null

        const formattedOrder = {
            ...order, categories: data.orderCategories.map(o => o.name).join(', '),
            unit: order.unit as string,
            amountPaid: formatter.format(parseFloat(String(order.amountPaid))).toLowerCase(),
            balance: formatter.format(parseFloat(String(order.balance))).toLowerCase(),
            createdAt: format(order.createdAt, "PPP"),
            updatedAt: format(order.createdAt, "PPP"),
            appointmentId: order.appointmentId,
            status: order.status,
            time: data?.appointment?.time ? data.appointment.time : undefined ,
            unitType: data?.appointment?.type ? data.appointment.type : undefined , 
            date: data.appointment?.date ? format(data?.appointment?.date, "PPP") : undefined,
            storeName: data.store.name
        }
        
        return formattedOrder

    } catch (error) {
        return null
    }
}

export const createOrder = async(data: z.infer<typeof orderSchema> , storeId: string, appointmentId?: string): Promise<ResponseObject> => {
    try {
        const month = getMonth();
        const year = new Date().getFullYear();

        const { userId } = auth()
        if(!userId) return {error: "Unauthenticated" }

        await orderSchema.safeParseAsync(data)

        if(!storeId) return { error: "Store id is required to create expense category" }

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access"}

        const createData = _.omit(data, ['categories']) // ignore categories on create

        if(appointmentId){
            // @ts-ignore -> fix later
             createData.appointmentId = appointmentId 
         }

        const order = await prismadb.order.create({
            data: {...createData, storeId, month, year,
                orderCategories: {
                    connect: data.categories.map(category => ({
                        id: category.value
                    }))
                }
            }
        });

        // add to google sheet
        if(store.sheet){  
            await createSheetOrders({ ...order, categories: data.categories.map(c => c.label).join(", ")}, store)
        }
        // push notifications
        await adminNotifications(store, 'An new order has been created')

        return { msg: "Order created" }

    } catch (error) {
        if(error instanceof z.ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`ORDER_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };   
    }
}

export const updateOrder = async(data: z.infer<typeof orderSchema>, id: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }
    
        await orderSchema.parseAsync(data);

        if (!storeId) return { error: "Store id is required to update an order" }
        
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access" }
    
        // get the current order
        const existingOrder = await prismadb.order.findUnique({
            where: { storeId, id },
            include: { orderCategories: true }
        });
    
        if (!existingOrder) return { error: "Order not found" }
        
        // Get existing orderCategories associated with the Order
        const existingOrderCategories = existingOrder.orderCategories;
    
        // Disconnect removed orderCategories
        const categoriesToDisconnect = existingOrderCategories.filter(
          category => data.categories.every(updatedCategory => updatedCategory.value !== category.id)
        );
    
        const updateOrder = _.omit(data, ["categories"]);
    
        const updatedOrder = await prismadb.order.update({
          where: { storeId, id },
          data: {
            ...updateOrder,
            orderCategories: {
              // remove old categories
              disconnect: categoriesToDisconnect.map(category => ({ id: category.id })),
              // set the new ones
              set: data.categories.map(c => ({ id: c.value }))
            }
          }
        });
        
        //update google sheet
        if(store.sheet){ 
            await updateSheetOrder({...updatedOrder, categories: data.categories.map(c => c.label).join(", ")}, store)
        }
    
        return { msg: "Order Updated"}
    } catch (error) {
        if(error instanceof z.ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`ORDER_UPDATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };   
    }
}

export const completeOrder = async(id: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if(!userId) return {error: "Unauthenticated" }

        if (!storeId) return { error: "Store id is required to update an order" }
        
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access" }

        const order = await prismadb.order.findFirst({ 
            where: { id, storeId }
        })

        if(!order) return { error: `No order was found ${id}` }

        let newAmountPaid = (parseFloat(String(order.amountPaid)) + parseFloat(String(order.balance)))
        let newStatus = order.status === "pending" ? "delivered" : "pending"

        const newOrder =  await prismadb.order.update({
            where: { id, storeId },
            data: { status: newStatus, amountPaid: newAmountPaid, balance: 0 },
            include: { orderCategories: true }
        })

        if(store.sheet){ 
           await updateSheetOrder({...newOrder, categories: newOrder.orderCategories.map(c => c.name).join(", ")}, store)
           if(newOrder.appointmentId !== null){
              // update appointmment status
              await statusSheetAppointment(newOrder.status, newOrder.appointmentId, store)
           }
        }

       return { msg: "Order updated"}

    } catch (error) {
        if (error instanceof Error) {
            console.error(`ORDER_COMPLETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
    return { error: "An unexpected error occurred" };   
    }
}

export const deleteOrder = async (orderId: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }
    
        if (!storeId) return { error: "Store id is required to delete order" }
  
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if (!store) return { error: "Unauthorized Access" }

        const order = await prismadb.order.findFirst({ where: { id: orderId, storeId } })
        if (!order) return { error: "Order does not exist" }

        if (order.appointmentId) { // order related to an appointment
            // reuse delete appointment server action
            const { error, msg } = await deleteAppointment(order.appointmentId as string, store.id)

            if (error) {
                console.error(`Error deleting appointment: ${error}`);
                return { error: "Error deleting appointment" };
            } else if (msg) {
                return { msg: "Order has been deleted" };
            }
            
            return { msg: "Order deleted" }

        } else {
            await prismadb.order.deleteMany({
                where: { id: orderId, storeId }
            })
            
            // delete from google sheet
            if (store.sheet) { await deleteSheetOrder(orderId, store) }

            return { msg: "Order deleted" }
        }
        
    } catch (error) {
        console.error(`ORDER_DELETE_ERROR: ${error instanceof Error ? error.message : "An unexpected error occurred"}`);
        return { error: "Something went wrong, try again" };
    }
}

//sync actions
export const syncCreateOrder = async(
    data: z.infer<typeof orderSchema>& { month: string, year: number, createdAt: Date, updatedAt: Date} , 
    storeId: string, 
    appointmentId?: string
): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if(!userId) return {error: "Unauthenticated" }

        await orderSchema.safeParseAsync(data)

        if(!storeId) return { error: "Store id is required to create expense category" }

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access"}

        const createData = _.omit(data, ['categories']) // ignore categories on create

        if(appointmentId){
            // @ts-ignore -> fix later
             createData.appointmentId = appointmentId 
         }

        await prismadb.order.create({
            data: {...createData, storeId, month: data.month, year: data.year,
                createdAt: data.createdAt, updatedAt: data.updatedAt,
                orderCategories: {
                    connect: data.categories.map(category => ({
                        id: category.value
                    }))
                }
            }
        })

        return { msg: "Order created" }

    } catch (error) {
        if(error instanceof z.ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`ORDER_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };   
    }
}
