import { Appointment, Order, Store } from "@prisma/client";
import { sheetDB } from "./sheetConfig";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { formatter } from "@/lib/utils";
import { createNewClient } from "./sheetClient";

// google sheet based on store
const year = new Date().getFullYear()
const sheetTitle = `Orders-${year}` // auto-create new sheet every year

export const createSheetOrders = async (order: Order & { categories: string }, store: Store) => {
    const doc = await sheetDB(store);
    if(!doc) return
    let sheet = doc.sheetsByTitle[sheetTitle];

    if (!sheet) {
        sheet = await doc?.addSheet({ title: sheetTitle });
        const excludeKeys: string[] = ["storeId", "appointmentId"];
        const headers: string[] = Object.keys(order).filter(k => !excludeKeys.includes(k))
        await sheet?.setHeaderRow(headers);
    }

    try {
        // create order to google sheet
        await sheet?.addRow({
            ...order,
            unit: order.unit as string,
            amountPaid: formatter.format(parseFloat(String(order.amountPaid))).toLowerCase(),
            balance: formatter.format(parseFloat(String(order.balance))).toLowerCase(), 
            categories: order.categories,
            headSize: order.headSize as string,
            appointmentId: "null",// will be ignored by google sheet
            note: order.note ? order.note : "null",
            createdAt: new Date(order.createdAt).toLocaleDateString(),
            updatedAt: new Date(order.updatedAt).toLocaleDateString(),
        });
        
        // create a new client to google sheet if none exists
        await createNewClient(store, order)
        
    } catch (error) {
        if(error instanceof Error){
            console.error("Error adding row to sheet:", error.message);
        } 
    }
}

export const deleteSheetOrder = async (id: string, store: Store) => {
    const doc = await sheetDB(store);
    let sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return;

    try {
        let rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<Order>; 
            if (row.get("id") === id) {
                await row.delete();
            }
        }
    } catch (error) {
        if(error instanceof Error){
            console.error("Error deleting row from sheet:", error.message);
        } 
    }
}

export async function updateSheetOrder(order: Order & { categories: string }, store: Store) {
    const doc = await sheetDB(store);
    const sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return

    const updatedOrder = {
        ...order, unit: order.unit as string,
        amountPaid: formatter.format(parseFloat(String(order.amountPaid))).toLowerCase(),
        balance: formatter.format(parseFloat(String(order.balance))).toLowerCase(), 
        categories: order.categories,
        headSize: order.headSize as string,
        note:  order.note ? order.note : "null",
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        updatedAt: new Date(order.updatedAt).toLocaleDateString(),
    }
    
    // filter to ignore storeId and to not update the id as it is a constant
    const excludeKeys: string[] = ["storeId", "id"]; // to be ignored on update
    const updateProperties = Object.keys(order).filter(k => !excludeKeys.includes(k))

    try {
        const rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<Appointment>;
            if (row.get("id") === updatedOrder.id) {
                updateProperties.forEach(property => {
                    // @ts-ignore
                    row.set(property, updatedOrder[property]);
                });
                
                await row.save();
            }
        }
           
    } catch (error: any) {
        if(error instanceof Error){
            console.error("Error updating row to sheet:", error.message);
        } 
    }
}
