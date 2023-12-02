import { formatter } from "@/lib/utils";
import { Expense, ExpenseImage, Store } from "@prisma/client";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { sheetDB } from "./sheetConfig";
import { IExpenseSheet } from "@/types/expenseTypes";


// google sheet based on store
const year = new Date().getFullYear()
const sheetTitle = `Expenses-${year}` // auto-create new sheet every year

export const convertImagesToString = (images: ExpenseImage[]) => {
    let imageArr: any[] = []
    images.forEach(i => imageArr.push(i.url))
    return imageArr.join(', ') // convert to string and separate with space
}

export const createSheetExpenses = async (expense: Expense, category: string, store: Store, images: ExpenseImage[]) => {
    // category to replace expenseCategoryId in google sheet
    // images if reciept is uploaded only get the urls and join them as string[]
    const doc = await sheetDB(store);
    if(!doc) return
    let sheet = doc.sheetsByTitle[sheetTitle];

    if (!sheet) {
        sheet = await doc?.addSheet({ title: sheetTitle });
        const excludeKeys: string[] = ["storeId", "expenseCategoryId"];
        const headers: string[] = Object.keys(expense).filter(k => !excludeKeys.includes(k)) //ignore storeId & expenseCategoryId in google sheet
        const updatedHeaders = [...headers, "recieptUrl", "category",] // add category and reciept url
        await sheet?.setHeaderRow(updatedHeaders);
    }

    try {
        await sheet?.addRow({ 
            ...expense, amount: formatter.format(parseFloat(String(expense.amount))).toLocaleLowerCase(), category,
            recieptUrl: images.length > 0 ? convertImagesToString(images) : "null",
            createdAt: new Date(expense.createdAt).toLocaleDateString(),
            updatedAt: new Date(expense.updatedAt).toLocaleDateString(),
        });
    } catch (error) {
        if(error instanceof Error){
            console.error("Error adding row to sheet:", error.message);
        } 
    }
}

export const updateSheetExpenses = async (expense: Expense, category: string, store: Store, images: ExpenseImage[]) => {
    const doc = await sheetDB(store);
    let sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return
    const excludeKeys: string[] = ["storeId", "expenseCategoryId", "id"]; // to be ignored on update
    const updateProperties = Object.keys(expense).filter(k => !excludeKeys.includes(k))

    const updatedData = {
        ...expense, amount: formatter.format(parseFloat(String(expense.amount))).toLocaleLowerCase(),
        createdAt: new Date(expense.createdAt).toLocaleDateString(),
        updatedAt: new Date(expense.updatedAt).toLocaleDateString(),
    }

    try {
        let imagesUrl: string
        if(images.length > 0){ imagesUrl = convertImagesToString(images) }

        const rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<IExpenseSheet>;
            if (row.get("id") === expense.id) {
                updateProperties.forEach(property => {
                    // @ts-ignore
                    row.set(property, updatedData[property]);
                    row.set("recieptUrl", imagesUrl ?? "null")
                    row.set("category", category)
                });
                await row.save();
            }
        }

    } catch (error) {
        if(error instanceof Error){
            console.error("Error updating sheet row:", error.message);
        } 
    }
}

export const deleteSheetExpenses = async (id: string, store: Store) => {
    const doc = await sheetDB(store);
    let sheet = doc?.sheetsByTitle[sheetTitle];

    if (!sheet) return;

    try {
        let rows = await sheet.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i] as GoogleSpreadsheetRow<Expense>; 
            if (row.get("id") === id) {
                await row.delete();
            }
        }
    } catch (error) {
        if(error instanceof Error){
            console.error("Error deleting row to sheet:", error.message);
        } 
    }
}
