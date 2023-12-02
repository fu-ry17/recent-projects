"use server"

import { AppointmentColumns } from "@/app/__components/appointments/columns";
import { getMonth } from "@/lib/dataArr";
import prismadb from "@/lib/prisma";
import { appointmentSchema, orderSchema } from "@/lib/schema";
import { ResponseObject } from "@/types/types";
import { createSheetAppointments } from "@/utils/sheetAppointments";
import { createSheetOrders } from "@/utils/sheetOrders";
import { format } from "date-fns";
import _ from "lodash";
import { z } from "zod";
import { calculateAppointmentTotal } from "./appointment-actions";
import { adminNotifications } from "./notification-action";

// Appointments
// book appointment online
export const bookOnlineAppointment = async (storeId: string, data: z.infer<typeof appointmentSchema>): Promise<ResponseObject> => {
    try {
        await appointmentSchema.parseAsync(data);

        if (!storeId) return { error: "Store id is required to create an expense category" }

        const store = await prismadb.store.findFirst({ where: { id: storeId } });
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

        const { error } = await createAppointmentOnlineOrder(newObject, storeId, appointment.id);
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
        return { msg: "Appointment successfully booked" }

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

//auto create online order
export const createAppointmentOnlineOrder = async(data: z.infer<typeof orderSchema> , storeId: string, appointmentId?: string): Promise<ResponseObject> => {
    try {
        const month = getMonth();
        const year = new Date().getFullYear();

        await orderSchema.safeParseAsync(data)

        if(!storeId) return { error: "Store id is required to create expense category" }

        const store = await prismadb.store.findFirst({ where: { id: storeId }})
        if(!store) return { error: "Unauthorized Access"}

        const createData = _.omit(data, ['categories']) // ignore categories on create

        if(appointmentId){
            // @ts-ignore -> fix later
             createData.appointmentId = appointmentId 
         }

        const order = await prismadb.order.create({
            data: {...createData, storeId, month, year, type: 'online',
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

