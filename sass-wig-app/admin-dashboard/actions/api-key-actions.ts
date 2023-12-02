"use server"

import prismadb from "@/lib/prisma";
import { decryptApiKey, encryptApiKey } from "@/lib/utils";
import { ResponseObject } from "@/types/types";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { v4 } from "uuid"

const secure_key = "ryaw6dtq8u09wpqudqt7wtrf7yqthw8sdgwytrer6df76wt78dt76dr6w7ty" // store in dotenv

export const generateApiKey = async(storeId: string) => {
    try {
        const { userId } = auth()

        if (!userId) return { error: "Unauthenticated"}
    
        if (!storeId) return { error: "Store id is required to update an expense" }
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    
        if (!store) return { error: "Unauthorized Access" }

        const apiKey = v4() // generate api key
        const encryptedApiKey = encryptApiKey(apiKey, secure_key)

        await prismadb.apiKey.create({
            data: { apiKey: encryptedApiKey, storeId }
        })

        return { msg: "Api key generated"}

    } catch (error) {
        if (error instanceof Error) {
            console.error(`CREATE_API_KEY_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const getApiKeys = async(storeId: string) => {
    try {
        const { userId } = auth()
        if(!userId) return []

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store)return []
        
        const data = await prismadb.apiKey.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' }})

        // decryptApiKey(item.apiKey, secure_key),
        
        const formattedKeys = data.map(item => ({ 
            id: item.id,
            key: item.apiKey,
            active: item.active,
            copied: item.copied,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }))

        return formattedKeys

    } catch (error) {
        return []
    }
}

// deactive or reactivate apiKey
export const deactivateApiKey = async(storeId: string, id: string, customStatus?: boolean): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) { return { error: "Unauthenticated" } }

        if(!storeId) return { error: "Store id is required"}
        
        // check if api key exist
        const keyId = await prismadb.apiKey.findFirst({ where: { id , storeId }})
        if(!keyId) return { error: "Invalid api key!"}

        // activate or deactivate
        await prismadb.apiKey.update({ where: { id, storeId}, data: { active: customStatus ? customStatus : !keyId.active }})

        return { msg: "Api key status updated" }


    } catch (error) {
        if(error instanceof Error){
            console.log("ACTIVATE_DEACTIVATE_API_KEY", error.message)
            return { error: "Something went wrong, try again"}
         }

         return { error: "An unexpected error occured"}
    }
}

// delete or deactive if it's currently in use to avoid error
export const deleteApiKey = async(id: string, storeId: string): Promise<ResponseObject> => {
   try {
     const { userId } = auth();
     if (!userId) {
        return { error: "Unauthenticated" }
     }

    if(!storeId) return { error: "Store id is required"}
    // check if api key exist
    const keyId = await prismadb.apiKey.findUnique({ where: { id, storeId }})
    if(!keyId) return { error: "Invalid api key!-1"}

    if(keyId.copied === true && keyId.active === true){
        // deactivate
       const { error } =  await deactivateApiKey(storeId, id, false)
       if(error) return { error } // return the error
       return { msg: "Api key has been deactivated"}

    }else if(keyId.copied === true && keyId.active === false) {
        await prismadb.apiKey.delete({ where: { id, storeId }})
        return { msg: "Api key has been  deleted"}
    }

    // else statement
    await prismadb.apiKey.delete({ where: { id, storeId }})
    return { msg: "Api key deleted!"}

   } catch (error) {
    if(error instanceof Error){
        console.log("DELETE_API_KEY", error.message)
        return { error: "Something went wrong, try again"}
    }

    return { error: "An unexpected error occured"}
   }
}