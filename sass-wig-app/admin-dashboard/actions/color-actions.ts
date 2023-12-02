"use server"

import { ColorColumn } from "@/app/(dashboard)/[storeId]/(routes)/(products)/colors/[colorId]/_component/columns"
import prismadb from "@/lib/prisma"
import { colorSchema } from "@/lib/schema"
import { ResponseObject } from "@/types/types"
import { auth } from "@clerk/nextjs"
import { format } from "date-fns"
import { ZodError, z } from "zod"

export const getColors = async(storeId: string) => {
    try {
        const { userId } = auth()

        if (!userId) return []

        if(!storeId) return []

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return []

        const data = await prismadb.color.findMany({
            orderBy: { createdAt: 'desc' }
        })

        const formattedColors: ColorColumn[] = data.map((item) => ({
            ...item,
            createdAt: format(item.createdAt, "M/d/y"),
        }))

        return formattedColors

    } catch (error) {
        return []
    }
}


export const createColor = async(
    data: z.infer<typeof colorSchema>, storeId: string
): Promise<ResponseObject> => {
    try {
        const { userId } = auth()

        if (!userId) {
            return { error: "Unauthenticated" }
        }

        await colorSchema.parseAsync(data)

        if(!storeId) return { error: "Store id is required to create an expense"}

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access"}

        //check if color exists
        const check = await prismadb.color.findFirst({
          where: { name: data.name.toLowerCase().trim() }
        })
        if(check){ return { error: "Color already exists"} }

        await prismadb.color.create({ data: {...data, name: data.name.toLowerCase().trim() } })

        return { msg: "Color created" }
    
    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`COLOR_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateColor = async(data: z.infer<typeof colorSchema>, colorId: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()

        if (!userId) {
            return { error: "Unauthenticated" }
        }

        await colorSchema.parseAsync(data)

        if(!storeId) return { error: "Store id is required to create an expense"}

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access"}

        //check if color exists
        const check = await prismadb.color.findFirst({
            where: { id: colorId, name: data.name.toLowerCase().trim() }
        })
        if(!check){ return { error: "Color does not exist"} }

        await prismadb.color.update({
            where: { id: colorId }, data: { ...data, name: data.name.toLowerCase().trim() }
         })

        return { msg: "Color updated" }

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`COLOR_PATCH_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred", };
    }
}

export const deleteColor = async(colorId: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }
    
        if (!storeId) return { error: "Store id is required" }
        if (!colorId) return { error: "Expense id is required" }
  
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access" }
    
        await prismadb.color.deleteMany({
          where: { id: colorId}
        })
        
        return { msg: "Color deleted"}

    } catch (error) {
        if(error instanceof Error) {
            console.error(`COLOR_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}