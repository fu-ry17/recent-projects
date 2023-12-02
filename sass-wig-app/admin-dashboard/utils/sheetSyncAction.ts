import { Store } from "@prisma/client";
import { sheetDB } from "./sheetConfig";

export type SheetResponseObject = {
    error?: string,
    response?: {
        data: Record<string, string>[],
        headerRow: string[]
    }
}

export const getSheetData = async (sheetTitle: string, store: Store): Promise<SheetResponseObject> => {
    try {
      const doc = await sheetDB(store)
      if (!doc) {
        return { error: "Sheet not configured" }
      }
  
      const sheet = doc.sheetsByTitle[sheetTitle]
  
      await sheet.loadHeaderRow();
      const headerRow: string[] = sheet.headerValues
      if (!headerRow) {
        return { error: "Sheet headers not configured" }
      }
  
      const rows = await sheet.getRows()
      const data: Record<string, string>[] = []

      // rows.length
  
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const rowData: Record<string, string> = {}
  
        for (let j = 0; j < headerRow.length; j++) {
          const header = headerRow[j]
          const value = row.get(header)
          rowData[header] = value
        }
  
        data.push(rowData)
      }
  
      return { response: { data, headerRow } }

    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return { error: error.message };
      }
      return { error: "An unexpected error occurred" }
    }
}
  