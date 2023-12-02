"use server"
import prismadb from "@/lib/prisma"
import { expenseCategorySchema, storeSchema } from "@/lib/schema"
import { ResponseObject } from "@/types/types"
import { auth } from "@clerk/nextjs"
import { ZodError } from "zod"
import { format } from 'date-fns'
import { ExpenseCategoryColumn } from "@/app/__components/expenseCategory/columns"
import { getMonth } from "@/lib/dataArr"

export const getExpenseCategories = async(storeId: string) => {
    try {
        const { userId } = auth()
        if(!userId) return []

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store)return []
        
        const data = await prismadb.expenseCategory.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' }})

        const formattedExpenseCategories: ExpenseCategoryColumn[] = data.map(item => ({ 
            id: item.id,
            name: item.name,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }))

        return formattedExpenseCategories

    } catch (error) {
        return []
    }
}

export const createExpenseCategory = async (name: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
      
       if(!name) return { error: "Expense category title is required"}
       await expenseCategorySchema.parseAsync({name})

       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }

       const categ = await prismadb.expenseCategory.findFirst({ 
          where: { name: name.toLowerCase().replace(/ /g, '-') }
       })

        if(categ) { return { error: "Category already exists"} }
    
       await prismadb.expenseCategory.create({
            data: { name: name.toLowerCase().replace(/ /g, '-') , storeId }
       })
    
       return { msg: "Expense category created" };

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`EXPENSE_CATEGORY_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateExpenseCategory = async (name: string, storeId: string, id: string): Promise<ResponseObject> => {
    try {
       const { userId } = auth()
       if (!userId) { return { error: "Unauthorized access" } }

       if(!name) return { error: "Expense category title is required"}
       // zod validate
       await expenseCategorySchema.parseAsync({name})

       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
    
        await prismadb.expenseCategory.update({
            data: { name:  name.toLowerCase().replace(/ /g, '-') },  where: { id, storeId }
        })
    
        return { msg: "Expense Category updated" };

    } catch (error) {
        if(error instanceof ZodError){
           return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`EXPENSE_CATEGORY_PATCH_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const deleteExpenseCategory = async (id: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
       
       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
 
       const expenseCategory = await prismadb.expenseCategory.findFirst({ where: { id }, include: { expenses: true }})
       if(expenseCategory){
          if(expenseCategory.expenses.length > 0){ // Cannot delete if it has expenses
             return { error: "Delete all expenses related to the order category"}
          }
       }
    
       await prismadb.expenseCategory.delete({ where: { id, storeId }})
    
       return { msg: "Expense category deleted" };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`EXPENSE_CATEGORY_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

// expense category total calculated monthly
export const expenseCategoryTotal = async(storeId: string) => {
    try {
        const { userId } = auth()
        if(!userId) return null

        const month = getMonth()
        const year = new Date().getFullYear()
        
        const groupedCategories = await prismadb.expense.groupBy({
            by: "expenseCategoryId",
            where: { month: month, year: year, storeId: storeId },
            _count: { id: true },
            _sum: { amount: true },
        });

        const result = await Promise.all(
            groupedCategories.map(async (group) => {
              const expenseCategory = await prismadb.expenseCategory.findUnique({
                where: { id: group.expenseCategoryId, storeId },
                select: { name: true, id: true },
              });
          
              return {
                id: expenseCategory?.id,
                category: expenseCategory?.name,
                totalCount: group._count.id,
                totalAmount: parseFloat(String(group._sum.amount)),
              };
            })
        );

        const totalAmount = result.reduce((prev, current) => prev + parseFloat(String(current?.totalAmount)) ,0)

        return { result, totalAmount }
        
    } catch (error: any) {
        return null
    }
}