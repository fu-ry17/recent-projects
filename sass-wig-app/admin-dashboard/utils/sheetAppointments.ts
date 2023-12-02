import { Appointment, Store } from "@prisma/client";
import { sheetDB } from "./sheetConfig";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { AppointmentColumns } from "@/app/__components/appointments/columns";

// google sheet based on store
const year = new Date().getFullYear()
const sheetTitle = `Appointments-${year}` // auto-create new sheet every year

export const createSheetAppointments = async (appointment: AppointmentColumns, store: Store) => {
    const doc = await sheetDB(store);
    if(!doc) return
    let sheet = doc.sheetsByTitle[sheetTitle];

    if (!sheet) {
        sheet = await doc?.addSheet({ title: sheetTitle });
        const headers: string[] = Object.keys(appointment).filter(k =>k !== "storeId")
        await sheet?.setHeaderRow(headers);
    }

    try {
        await sheet?.addRow(appointment)
    } catch (error: any) {
        console.error("Error adding row to sheet:", error.message);
    }
}

export const deleteSheetAppointments = async (id: string, store: Store) => {
    const doc = await sheetDB(store);
    let sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return;

    try {
        let rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<Appointment>; 
            if (row.get("id") === id) {
                await row.delete();
            }
        }
    } catch (error: any) {
        console.error("Error deleting row from sheet:", error.message);
    }
}

export async function updateSheetAppointment(appointment: AppointmentColumns, store: Store) {
    const doc = await sheetDB(store);
    const sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return

    const excludeKeys: string[] = ["id"]; // to be ignored on update
    const updateProperties = Object.keys(appointment).filter(k => !excludeKeys.includes(k))

    try {
        const rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<Appointment>;
            if (row.get("id") === appointment.id) {
                updateProperties.forEach(property => {
                    // @ts-ignore
                    row.set(property, appointment[property]);
                });
                
                await row.save();
            }
        }
           
    } catch (error: any) {
        console.error("Error updating row in sheet:", error.message);
    }
}

// update status on order complete
export async function statusSheetAppointment(status: string, id: string, store: Store) {
    const doc = await sheetDB(store);
    const sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return

    try {
        const rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<any>;
            if (row.get("id") === id) {
                row.set("status", status) 
                await row.save();
            }
        }
           
    } catch (error: any) {
        console.error("Error updating row in sheet:", error.message);
    }
}
