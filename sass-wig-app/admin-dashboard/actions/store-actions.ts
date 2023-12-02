"use server"
import prismadb from "@/lib/prisma"
import { storeSchema } from "@/lib/schema"
import { ResponseObject } from "@/types/types"
import { auth } from "@clerk/nextjs"
import { ZodError } from "zod"

export const createStore = async (name: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }

       await storeSchema.parseAsync({name})
    
       const store = await prismadb.store.create({
            data: { name, userId }
        })
    
        return { msg: store.id };

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`STORE_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateStore = async (name: string, id: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
       
       // zod validate
       await storeSchema.parseAsync({name})

       //find store
       const store = await prismadb.store.findFirst({ where: { id, userId }})
       if(!store) return { error: "No store was found!"}
    
        await prismadb.store.update({
            data: { name },  where: { userId, id }
        })
    
        return { msg: "Store updated successfully" };

    } catch (error) {
        if(error instanceof ZodError){
           return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`STORE_PATCH_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const deletStore = async (id: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
       
       //find store
       const store = await prismadb.store.findFirst({ where: { id, userId }})
       if(!store) return { error: "No store was found!"}
    
       await prismadb.store.delete({ where: { id, userId }})
    
       return { msg: "Store deleted" };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`STORE_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

