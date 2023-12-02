"use server"
import { OrderCategoryColumn } from "@/app/__components/orderCategory/columns"
import prismadb from "@/lib/prisma"
import { orderCategorySchema } from "@/lib/schema"
import { formatter } from "@/lib/utils"
import { ResponseObject } from "@/types/types"
import { auth } from "@clerk/nextjs"
import * as z from "zod"
import { ZodError } from "zod"

export const getOrderCatgories = async(storeId: string) => {
    try {
        const { userId } = auth()
        if(!userId) return []

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store)return []

        const data = await prismadb.orderCategory.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' }})

        const formattedOrderCategories: OrderCategoryColumn[] = data.map(item => ({ 
            id: item.id,
            name: item.name,
            appointmentUse: item.appointmentUse,
            commissionAmount: formatter.format(parseFloat(String(item.comissionAmount))).toLowerCase()
        }))

        return formattedOrderCategories

    } catch (error) {
        return []
    }
}

export const getOrderCatgory = async(storeId: string, id: string) => {
    try {
        const { userId } = auth()
        if(!userId) return null

        const orderCategory = await prismadb.orderCategory.findUnique({ where: { id, storeId }})
        if(!orderCategory) return null 

        return {
            ...orderCategory, 
            comissionAmount: parseFloat(String(orderCategory.comissionAmount)),
            storeAmount: parseFloat(String(orderCategory.storeAmount)),
            nonStoreAmount: parseFloat(String(orderCategory.nonStoreAmount)),
         }
        
    } catch (error) {
        return null
    }
}

export const createOrderCategory = async (data: z.infer<typeof orderCategorySchema>, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
      
       await orderCategorySchema.parseAsync(data)

       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
    
       await prismadb.orderCategory.create({
            data: { ...data, name: data.name.toLowerCase().replace(/ /g, '-') , storeId }
       })
    
       return { msg: "Order category created" };

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`ORDER_CATEGORY_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateOrderCategory = async (data: z.infer<typeof orderCategorySchema>, storeId: string, id: string): Promise<ResponseObject> => {
    try {
       const { userId } = auth()
       if (!userId) { return { error: "Unauthorized access" } }
       
       // zod validate
       await orderCategorySchema.parseAsync(data)

       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
    
        await prismadb.orderCategory.update({
            data: { ...data, name: data.name.toLowerCase().replace(/ /g, '-') },  where: { id, storeId }
        })
    
        return { msg: "Order Category updated" };

    } catch (error) {
        if(error instanceof ZodError){
           return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`ORDER_CATEGORY_PATCH_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const deleteOrderCategory = async (id: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
       
       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }

       const orderCategory = await prismadb.orderCategory.findFirst({ where: { id }, include: { orders: true }})
       if(orderCategory){
          if(orderCategory.orders.length > 0){ // Cannot delete if it has orders
             return { error: "Delete all orders related to the order category"}
          }
       }
    
       await prismadb.orderCategory.delete({ where: { id, storeId }})
    
       return { msg: "Order category deleted" };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`ORDER_CATEGORY_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}
