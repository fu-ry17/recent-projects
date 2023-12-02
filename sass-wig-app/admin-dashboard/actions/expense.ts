"use server"

import { ExpenseColumns } from "@/app/__components/expenses/columns"
import cloudinary from "@/lib/cloudinary"
import { getMonth } from "@/lib/dataArr"
import prismadb from "@/lib/prisma"
import { expenseSchema } from "@/lib/schema"
import { formatter } from "@/lib/utils"
import { ResponseObject } from "@/types/types"
import { createSheetExpenses, deleteSheetExpenses, updateSheetExpenses } from "@/utils/sheetExpenses"
import { auth } from "@clerk/nextjs"
import { format } from "date-fns"
import { ZodError, z } from "zod"
import { adminNotifications } from "./notification-action"

export const getExpenses = async(storeId: string, searchParams: any) => {
    try {
        //searchParams
        const monthSearch = searchParams.month || ''
        const sort = searchParams.sort || 'desc'

        const month = getMonth()
        const year = new Date().getFullYear()

        const data = await prismadb.expense.findMany({ 
            where: { storeId: storeId, month: monthSearch ? monthSearch : month, year },
            include: { expenseCategory: true },
            orderBy: { createdAt: sort }
        })
      
        const formattedExpenses: ExpenseColumns[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.expenseCategory.name,
            amount: formatter.format(item.amount.toNumber()).toLowerCase(),
            createdAt: format(item.createdAt, "M/d/y"),
        }))

        return formattedExpenses

    } catch (error) {
        return []
    }
}

export const getExpense = async(id: string, storeId: string) => {
    try {
        const expense = await prismadb.expense.findUnique({ where: { id, storeId },
            include: { expenseCategory: true, expenseImages: true }
        })
    
        if(!expense) return null

        return {...expense, amount: parseFloat(String(expense?.amount))}   
        
    } catch (error) {
        return null
    }
}

export const createExpense = async(
    data: z.infer<typeof expenseSchema> & { images: any[]} ,
    storeId: string
): Promise<ResponseObject> => {
    try {
        const month = getMonth();
        const year = new Date().getFullYear();

        const { userId } = auth();
        if (!userId) {
            return { error: "Unauthenticated" }
        }

        const { title, amount, category, reference, images } = await data
        await expenseSchema.parseAsync({ title, amount, category, reference });

        if(!storeId) return { error: "Store id is required to create an expense"}

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access"}

        let expenseData: any = { 
            title, amount, expenseCategoryId: category.value, month, year, storeId, reference,
        };

        if (images && images.length > 0) {
            expenseData.expenseImages = {
                createMany: {
                    data: images.map((image: { url: string, referenceId: string }) => image),
                },
            };
        }

        const expense = await prismadb.expense.create({
            data: expenseData,
        });

        if(store.sheet){
            // get the created expense and add it to google sheet
            const createdExpense = await prismadb.expense.findUnique({ 
                where: { id: expense.id, storeId },
                include: { expenseCategory: true, expenseImages: true }
            })

            await createSheetExpenses(expense, createdExpense?.expenseCategory?.name as string, store, createdExpense?.expenseImages ?? [])
        }
        // push notifications
        await adminNotifications(store, 'An new expense has been created')

        return { msg: "Expense created" }
    
    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`EXPENSE_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateExpense = async(data: any, expenseId: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth();

        if (!userId) return { error: "Unauthenticated"}
    
        const { title, amount, category, reference, images } = data
        await expenseSchema.parseAsync({ title, amount, category, reference });
    
        if (!storeId) return { error: "Store id is required to update an expense" }
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
    
        if (!store) return { error: "Unauthorized Access" }
    
        let expenseData: any = { 
           title, amount, expenseCategoryId: category.value, reference,
        };
    
        if (images && images.length > 0) {
            expenseData.expenseImages = {
                createMany: {
                    data: images.map((image: { url: string, referenceId: string }) => image),
                },
            };
        }
    
        // Delete images from Cloudinary and then from the database
        const expenseImages = await prismadb.expenseImage.findMany({ where: { expenseId } });
        if (expenseImages.length > 0) {
          await Promise.all(expenseImages.map(async (i: any) => {
            await cloudinary.uploader.destroy(i.referenceId); // del cloudinary
            await prismadb.expenseImage.delete({ where: { id: i.id } }); // del database
          }));
        }
    
        // Update the data
        const expense = await prismadb.expense.update({
            where: { id: expenseId, storeId: storeId }, data: expenseData
        });
    
        if(store.sheet){
          //update google sheet
          const updatedExpense = await prismadb.expense.findUnique({
            where: { id: expense.id, storeId: storeId },
            include: { expenseCategory: { select: { name: true }}, expenseImages: true }
          }) 
          await updateSheetExpenses(expense, updatedExpense?.expenseCategory?.name as string, store, updatedExpense?.expenseImages ?? [])
        }

        return { msg: "Expense updated" }

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`EXPENSE_PATCH_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred", };
    }
}

export const deleteExpense = async(expenseId: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }
    
        if (!storeId) return { error: "Store id is required" }
        if (!expenseId) return { error: "Expense id is required" }
  
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access" }
  
        //delete images from cloudinary and db
        const expenseImages = await prismadb.expenseImage.findMany({ where: { expenseId } });
        if (expenseImages.length > 0) {
          await Promise.all(expenseImages.map(async (i: any) => {
            await cloudinary.uploader.destroy(i.referenceId); // del cloudinary
            await prismadb.expenseImage.delete({ where: { id: i.id } }); // del database
          }));
        }
    
        await prismadb.expense.deleteMany({
          where: { id: expenseId, storeId }
        })
        
        if(store.sheet){
          // delete from google sheet
          await deleteSheetExpenses(expenseId, store)
        } 
        
        return { msg: "Expense deleted"}

    } catch (error) {
        if(error instanceof Error) {
            console.error(`EXPENSE_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

//sync-action
export const syncCreateExpense = async(
    data: z.infer<typeof expenseSchema> & { images: any[], createdAt: Date, updatedAt: Date, month: string, year: number } ,
    storeId: string
): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { error: "Unauthenticated" }
        }

        const { title, amount, category, reference, images } = await data
        await expenseSchema.parseAsync({ title, amount, category, reference });

        if(!storeId) return { error: "Store id is required to create an expense"}

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access"}

        let expenseData: any = { 
            title, amount, expenseCategoryId: category, month: data.month,
            year: data.year, storeId, reference, createdAt: data.createdAt, updatedAt: data.updatedAt
        };

        if (images && images.length > 0) {
            expenseData.expenseImages = {
                createMany: {
                    data: images.map((image: { url: string, referenceId: string }) => image),
                },
            };
        }

        await prismadb.expense.create({
            data: expenseData,
        });

        return { msg: "Expense created" }
    
    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`EXPENSE_CREATE_ERROR: ${error.message}`);
            return { error: error.message};
        }
        return { error: "An unexpected error occurred" };
    }
}