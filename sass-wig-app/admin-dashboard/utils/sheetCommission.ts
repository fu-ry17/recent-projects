import { Comission, Store } from "@prisma/client";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { sheetDB } from "./sheetConfig";
import { ICommission } from "@/actions/commission-actions";

// google sheet based on store
const year = new Date().getFullYear()
const sheetTitle = `Commissions-${year}` // auto-create new sheet every year

export const createSheetCommission = async (commission: ICommission, store: Store) => {
    const doc = await sheetDB(store);
    if(!doc) return
    let sheet = doc.sheetsByTitle[sheetTitle];

    if (!sheet) {
        sheet = await doc?.addSheet({ title: sheetTitle });
        const headers: string[] = Object.keys(commission)
        await sheet?.setHeaderRow(headers);
    }

    try {
        await sheet?.addRow(commission)
    } catch (error: any) {
        console.error("Error adding row to sheet:", error.message);
    }
}

export async function updateSheetCommission(commission: ICommission, store: Store) {
    const doc = await sheetDB(store);
    const sheet = doc?.sheetsByTitle[sheetTitle];
    
    if (!sheet) return
    
    const excludeKeys: string[] = ["id"]; // to be ignored on update
    const updateProperties = Object.keys(commission).filter(k => !excludeKeys.includes(k))
    
    try {
        const rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<ICommission>;
            if (row.get("id") === commission.id) {
                updateProperties.forEach(property => {
                    // @ts-ignore
                    row.set(property, commission[property]);
                });
                    
                await row.save();
            }
        }
               
    } catch (error: any) {
        console.error("Error updating row in sheet:", error.message);
    }
}

export const deleteSheetCommission = async (id: string, store: Store) => {
    const doc = await sheetDB(store);
    let sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return;

    try {
        let rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<Comission>; 
            if (row.get("id") === id) {
                await row.delete();
            }
        }
    } catch (error: any) {
        console.error("Error deleting row from sheet:", error.message);
    }
}

// update status to paid
export async function statusSheetCommission(status: string, id: string, store: Store) {
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
