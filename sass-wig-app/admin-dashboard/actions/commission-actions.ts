"use server"
import { CommissionColumn } from "@/app/__components/commissions/column"
import { getMonth, monthNames } from "@/lib/dataArr"
import prismadb from "@/lib/prisma"
import { commissionSchema } from "@/lib/schema"
import { formatCategory, formatter, groupDataByWeek } from "@/lib/utils"
import { ResponseObject } from "@/types/types"
import { createSheetCommission, deleteSheetCommission, statusSheetCommission } from "@/utils/sheetCommission"
import { auth } from "@clerk/nextjs"
import { Comission } from "@prisma/client"
import { endOfWeek, format, startOfWeek, getWeeksInMonth, addWeeks } from "date-fns"
import _ from 'lodash'
import { ZodError, z } from "zod"
import { adminNotifications } from "./notification-action"

export type CommissionResponse = {
    month: string
    count: number,
    groupedCommission: Record<string, any[] | CommissionColumn[]>
}

export type ICommission = {
    id: string;
    employee_name: string;
    unit: string;
    service: string;
    total: string;
    month: string;
    year: number;
    createdAt: string;
    updatedAt: string;
}

const calculateCommissionTotal = async (services: { value: string, label: string}[]) => {
    const servicePromises = services.map(async s => {
        const oc = await prismadb.orderCategory.findUnique({ where: { id: s.value } })
        if(oc){
            return parseFloat(String(oc?.comissionAmount))
        }
        return 0
    })

    const serviceTotals = await Promise.all(servicePromises)
    const total = serviceTotals.reduce((a, c) => a + c, 0)

    return total
}

const formatCommission = (commission: Comission, total: number, data: z.infer<typeof commissionSchema>) => {
    const commissionData = { 
        id: commission.id, employee_name: commission.name, unit: commission.unit, service: data.services.map(s => s.label).join(', '), 
        total: formatter.format(total).toLowerCase(), month: commission.month , year: commission.year,
        createdAt: format(commission.createdAt, "M/d/y"), updatedAt: format(commission.createdAt, "M/d/y"),
    }

    return commissionData
}

const calculateWeeklyTotal = (data: Comission[]) => {
    const currentDate = new Date(); // change date daily
    const uniqueNames = new Set<string>();

    // collect unique user names
    data.forEach(item => uniqueNames.add(item.name.toLowerCase().trim()))
    
    const userTotals: Record<string, number> = {}
    
    // Calculate the total for each unique user
    uniqueNames.forEach(name => {
      const total = data.reduce((init, currentItem) => {
        if (currentItem.name.toLowerCase().trim() === name) {
          return init + Number(currentItem.total)
        }
        return init;
      }, 0);
      
      userTotals[name] = total;
    })

    const resultArray = Object.entries(userTotals).map(([name, value]) => ({
        name: name,
        value: value
    }))

    const total = resultArray.reduce((init, curr) => {
        return (init + curr.value)
    },0)

    return { 
        total: formatter.format(total).toLowerCase(),
        data: resultArray.map(d => ({
            name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
            value: formatter.format(d.value).toLowerCase(),
            date: format(currentDate, "M/d/y")
        }))
    } 
}

const comissionWeekDate = () => {
    // find a way to find the no of weeks in the month
    const date = new Date(2023, 11, 1) 
    const noOfweeks = getWeeksInMonth(date)

    const startDaysOfEachWeek = [];

    // Loop through each week and get the first day of that week
    for (let i = 0; i < noOfweeks; i++) {
        const startOfWeekDate = startOfWeek(addWeeks(date, i));
        const weekStartDate = format(startOfWeekDate, 'yyyy-MM-dd');
        startDaysOfEachWeek.push({ [`week${i + 1}`]: weekStartDate });
    }
}

export const getCommissions = async(storeId: string, searchParams: any): Promise<CommissionResponse | []> => {
    try {
        //searchParams
        const monthSearch = searchParams.month || ''
        const sort = searchParams.sort || 'desc'

        //month & year
        const month = getMonth()
        const year = new Date().getFullYear()

        const { userId } = auth()
        if(!userId) return []

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store)return []
        
        const data = await prismadb.comission.findMany({ 
            where: { storeId, month: monthSearch ? monthSearch : month }, orderBy: { createdAt: sort }, 
            include: { orderCategories: true }
        })

        const count = await prismadb.comission.count({ where: { storeId, month: monthSearch ? monthSearch : month }})

        const formatedCommission: CommissionColumn[] = data.map(c =>({
            id: c.id,
            name: c.name,
            unit: c.unit,
            amount: formatter.format(c.total.toNumber()).toLowerCase(),
            service:  c.orderCategories.map(o => o.name).join(", ") as string,
            paid: c.paid,
            date: format(c.createdAt, "M/d/y"),
        }))

        // get monthIndex
        const monthIndex = monthNames.findIndex(m => m === month);

        const groupedCommission = groupDataByWeek(year, monthIndex + 1, formatedCommission)

       return { count, month: monthSearch ? monthSearch : month, groupedCommission } 

    } catch (error) {
        return []
    }
}

export const getCommission = async(id: string, storeId: string) => {
    try {
        const { userId } = auth()
        if(!userId) return null

        const commission = await prismadb.comission.findUnique({ where: { id, storeId },
            include: { orderCategories: true }
        })
    
        if(!commission) return null

        const ignoreData = _.omit(commission, ['orderCategories'])

        const response = {...ignoreData, services: formatCategory(commission.orderCategories), total: parseFloat(String(commission?.total))}  
        
        return response
        
    } catch (error) {
        return null
    }
}

export const createCommission = async (data: z.infer<typeof commissionSchema>, storeId: string): Promise<ResponseObject> => {
    try {
        const month = getMonth()
        const year = new Date().getFullYear()

        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
      
       await commissionSchema.parseAsync(data)

       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
    
       const createData = _.omit(data, ['services']) // ignore categories on create

       //calculate total
       const total = await calculateCommissionTotal(data.services)

       const commission = await prismadb.comission.create({
           data: {...createData, storeId, month, year, total,
               orderCategories: {
                   connect: data.services.map(category => ({
                       id: category.value
                   }))
               }
           }
       })

       // add google sheet functionality
       if(store.sheet){ 
          const response = formatCommission(commission, total, data)
          await createSheetCommission(response, store)
       }

        // push notifications
        await adminNotifications(store, 'An new commission has been created')

       return { msg: "Commission created" };

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`COMMISSION_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateCommission = async (data: z.infer<typeof commissionSchema>, storeId: string, id: string): Promise<ResponseObject> => {
    try {
       const { userId } = auth()
       if (!userId) { return { error: "Unauthorized access" } }

       // zod validate
       await commissionSchema.parseAsync(data)

       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
    
         // get the current order
        const existingCommission = await prismadb.comission.findUnique({
            where: { storeId, id }, include: { orderCategories: true }
        });
    
        if (!existingCommission) return { error: "Commission not found" }
        
        // Get existing orderCategories associated with the Order
        const existingOrderCategories = existingCommission.orderCategories;
    
        // Disconnect removed orderCategories
        const categoriesToDisconnect = existingOrderCategories.filter(
          category => data.services.every(updatedCategory => updatedCategory.value !== category.id)
        );
    
        const updateCommission = _.omit(data, ["services"]);

        //update total
        const total = await calculateCommissionTotal(data.services)
    
        const updatedCommission = await prismadb.comission.update({
          where: { storeId, id },
          data: {...updateCommission, total,
            orderCategories: {
              // remove old categories
              disconnect: categoriesToDisconnect.map(category => ({ id: category.id })),
              // set the new ones
              set: data.services.map(c => ({ id: c.value }))
            }
          }
        });
        
        //update google sheet
        if(store.sheet){ 
            const response = formatCommission(updatedCommission, total, data)
            await createSheetCommission(response, store)
         }
    
        return { msg: "Commission Updated"}
    } catch (error) {
        if(error instanceof z.ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`COMMISSION_UPDATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };   
    }
}

export const deleteCommission = async (id: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
       
       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
     
       await prismadb.comission.delete({ where: { id, storeId }})
       
       // delete from google sheet
       if(store.sheet){ await deleteSheetCommission(id, store) }
    
       return { msg: "Commission deleted" };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`COMMISSION_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const completeCommission = async (id: string, storeId: string, paid: boolean): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
       
       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }
     
       await prismadb.comission.update({ 
          where: { id, storeId }, data: { paid }
       })

        // updte google sheet status
       if(store.sheet){ await statusSheetCommission(paid === true ? 'true' : 'false', id, store) }
    
       return { msg: "Commission updated" };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`COMMISSION_DELETE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const weeklyCommission = async (storeId: string, searchParams: any) => {
    try {
        // searchParams
        const monthSearch = searchParams.month || ''
        const sort = searchParams.sort || 'desc'
        const month = getMonth()

        const year = new Date().getFullYear()

        // // find a way to find the no of weeks in the month
        // const date = new Date(2023, 11, 1) 
        // const noOfweeks = getWeeksInMonth(date)

        // const startDaysOfEachWeek = [];

        // // Loop through each week and get the first day of that week
        // for (let i = 0; i < noOfweeks; i++) {
        //     const startOfWeekDate = startOfWeek(addWeeks(date, i));
        //     const weekStartDate = format(startOfWeekDate, 'yyyy-MM-dd');
        //     startDaysOfEachWeek.push({ [`week${i + 1}`]: weekStartDate });
        // }

        // month & year
        const currentDate = new Date();
        console.log({ currentDate })
        const startOfThisWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 means Sunday
        const endOfThisWeek = endOfWeek(currentDate, { weekStartsOn: 0 });
        
        const { userId } = auth();
        if (!userId) return [];

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return [];
        
        const data = await prismadb.comission.findMany({ 
            where: { 
                storeId, 
                month: monthSearch ? monthSearch : month, // wil filter to remove previous month
                createdAt: {
                    gte: startOfThisWeek,
                    lte: endOfThisWeek,
                }
            },
            orderBy: { createdAt: sort }
        });

        const weeklyTotal = calculateWeeklyTotal(data)

        return weeklyTotal
       
    } catch (error) {
        return [];
    }
}