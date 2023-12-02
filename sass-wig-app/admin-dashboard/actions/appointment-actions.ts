"use server"

import { AppointmentColumns } from "@/app/__components/appointments/columns"
import { getMonth } from "@/lib/dataArr"
import prismadb from "@/lib/prisma"
import { appointmentSchema, orderSchema } from "@/lib/schema"
import { formatCategory } from "@/lib/utils"
import { ResponseObject } from "@/types/types"
import { createSheetAppointments, deleteSheetAppointments, updateSheetAppointment } from "@/utils/sheetAppointments"
import { deleteSheetOrder } from "@/utils/sheetOrders"
import { auth } from "@clerk/nextjs"
import { format } from "date-fns"
import _ from "lodash"
import * as z from "zod"
import { adminNotifications } from "./notification-action"
import { createOrder, updateOrder } from "./order-ations"

export const calculateAppointmentTotal = async (type: string, services: { value: string, label: string}[]) => {
    const servicePromises = services.map(async s => {
        const oc = await prismadb.orderCategory.findUnique({ where: { id: s.value } })
        if (type === "store") {
            return parseFloat(String(oc?.storeAmount))
        } else if (type === "non-store") {
            return parseFloat(String(oc?.nonStoreAmount))
        }
        return 0
    })

    const serviceTotals = await Promise.all(servicePromises)
    const total = serviceTotals.reduce((a, c) => a + c, 0)

    return total
}

export const getAppointments = async (storeId: string, searchParams: any) => {
    // search params
    const monthSearch = searchParams.month || ''
    const sort = searchParams.sort || 'desc'
    const status = searchParams.status
    
    const month = getMonth()
    const year = new Date().getFullYear()
    
    // move to types files
    type Clause = { storeId: string, month: string, year: number, status?: string } 

    const whereClause: Clause = {
      storeId, month: monthSearch ? monthSearch : month, year
    };
    
    if (status) { whereClause.status = status }

    const data = await prismadb.appointment.findMany({
        where: { order: whereClause}, 
        include: { order: { include: { orderCategories: true }} },
        orderBy: { date: sort }
    })
  
    const formattedAppointments: (AppointmentColumns & {orderId: string })[] = data.map((item) => ({
        id: item.id,
        unit: item.order?.unit as string,
        date:  format(item.date, "M/d/y"),
        status: item.order?.status as string,
        name: item.order?.name as string,
        orderId: item.order?.id as string,
        services: item.order?.orderCategories.map(o => o.name).join(", ") as string,
        time: item.time
    }))

    return formattedAppointments
}

export const getAppointment = async(appointmentId: string, storeId: string) => {
    try {
        const appointment = await prismadb.appointment.findUnique({ 
            where: { id: appointmentId, storeId }, 
            include: { order: { include: { orderCategories: true }} }
       })

       if(!appointment) return null

       const formattedAppointment: z.infer<typeof appointmentSchema> & { id: string | null, orderId: string | null } = {
           ...appointment,
           id: appointment.id as string,
           orderId: appointment.order?.id as string,
           type: appointment.type as string,
           name: appointment.order?.name as string,
           phone: appointment.order?.phone as string,
           note: appointment.order?.note as string,
           services: formatCategory(appointment.order?.orderCategories as any[]) ,
           unit: appointment.order?.unit as string
       }

       return formattedAppointment

    } catch (error) {
        if(error instanceof Error){
            console.log(`GET_APPOINTMENT_ERROR`, error.message)
            return null
        }
        return null
    }
}

export const createAppointment = async (storeId: string, data: z.infer<typeof appointmentSchema>): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }

        await appointmentSchema.parseAsync(data);

        if (!storeId) return { error: "Store id is required to create an expense category" }

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access" }

        const appointment = await prismadb.appointment.create({
            data: { date: data.date, type: data.type, time: data.time, storeId },
        });

        if(!appointment) return { error: "Failed to create appointment"}

        const orderData = _.omit(data, ['services', 'time', 'type', 'date']);
        
        // Calculate balance concurrently
        const balance = await calculateAppointmentTotal(data.type, data.services);

        const newObject: z.infer<typeof orderSchema> = {
            ...orderData, categories: data.services, balance, headSize: "medium", quantity: 1,
            amountPaid: 0, paymentMethod: "mpesa/card",
        };

        const { error } = await createOrder(newObject, storeId, appointment.id);
        if (error) return { error };

        if (store.sheet) { // add to google sheet
            const appointmentData = await prismadb.appointment.findUnique({ 
                where: { id: appointment.id, storeId },
                include: { order: true }
            })

            if(!appointmentData) return { error: "Failed to load appointment"}

            const formattedAppointments: AppointmentColumns & { note: string } = {
                id: appointment.id, ...data,
                services: data.services.map(o => o.label).join(", "),
                note: data.note ? data.note : "null",
                status: appointmentData?.order?.status as string,
                date: format(appointment.date, "M/d/y"),
            };
        
            // Create the sheet appointment concurrently
            await createSheetAppointments(formattedAppointments, store);
        }
        // push notifications
        await adminNotifications(store, 'An new appointment has been created')
        return { msg: "Appointment created" }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        } else if (error instanceof Error) {
            console.error(`APPOINTMENT_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

// update the function
export const updateAppointment = async (
    storeId: string, id: string, 
    data: z.infer<typeof appointmentSchema>
): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }

        await appointmentSchema.parseAsync(data);

        if (!storeId) return { error: "Store id is required to create an expense category" }

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access" }

        const appointment = await prismadb.appointment.update({
            where: { id, storeId },
            data: { date: data.date, type: data.type, time: data.time },
            include: { order: { include: { orderCategories: true }}}
        });

        if(!appointment) return { error: "Failed to update appointment"}

        const orderData = _.omit(data, ['services', 'time', 'type', 'date']);
        
        // Calculate balance concurrently
        const balance = await calculateAppointmentTotal(data.type, data.services);

        const newObject: z.infer<typeof orderSchema> = {
            ...orderData, categories: data.services, balance,
            unit: data.unit, headSize: appointment.order?.headSize as string,
            quantity: appointment.order?.quantity as number, amountPaid: parseFloat(String(appointment.order?.amountPaid)), 
            paymentMethod: appointment.order?.paymentMethod as string,
        };
        
        // include order id 
        const { error } = await updateOrder(newObject, appointment?.order?.id as string, storeId);
        if (error) return { error };

        if (store.sheet) { // add to google sheet
            const appointmentData = await prismadb.appointment.findUnique({ 
                where: { id: appointment.id, storeId },
                include: { order: true }
            })

            if(!appointmentData) return { error: "Failed to load appointment"}

            const formattedAppointments: AppointmentColumns & { note: string } = {
                id: appointment.id, ...data,
                unit: data.unit as string,
                services: data.services.map(o => o.label).join(", "),
                note: data.note ? data.note : "null",
                status: appointmentData?.order?.status as string,
                date: format(appointment.date, "M/d/y"),
            };
        
            // Create the sheet appointment concurrently
            await updateSheetAppointment(formattedAppointments, store);
        }

        return { msg: "Appointment updated" }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        } else if (error instanceof Error) {
            console.error(`APPOINTMENT_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const deleteAppointment = async(appointmentId: string, storeId: string ): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthenticated" }
    
        if (!storeId) return { error: "Store id is required to delete order" }
  
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store) return { error: "Unauthorized Access" }

        const appointment = await prismadb.appointment.findFirst({ where: { id: appointmentId, storeId }, include: { order: true } })
        if(!appointment) return { error: "Appointment was not found or is already deleted!"}
        
        await prismadb.appointment.deleteMany({ 
            where: { id: appointmentId, storeId }
        });
        
        // delete from google sheet
        if(store.sheet){ 
            await deleteSheetAppointments(appointmentId, store) 
            // delete order from google sheet
            await deleteSheetOrder(appointment?.order?.id as string, store)
        }
      
        return { msg: "Appointment deleted"}

    } catch (error) {
        if (error instanceof Error) {
            console.error(`APPOINTMENT_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}