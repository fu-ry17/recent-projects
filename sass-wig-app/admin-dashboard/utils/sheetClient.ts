import { Order, Store } from "@prisma/client";
import { sheetDB } from "./sheetConfig";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

const sheetTitle = 'Clients-and-Contacts'

export interface IDetails{ phone: string, client_name: string }

export const createNewClient = async (store: Store, inputs: Order) => { // works perfectly
  const doc = await sheetDB(store);
  if (!doc) return

  let sheet = doc.sheetsByTitle[sheetTitle];

  if (!sheet) {
    sheet = await doc.addSheet({ title: sheetTitle });
    const headers: string[] = ["client_name", "phone"];
    await sheet.setHeaderRow(headers);
  }

  try {
    const rows: GoogleSpreadsheetRow<IDetails>[] = await sheet.getRows()

    const existingClient = rows.find((row) => row.get("phone") === inputs.phone);

    if (existingClient) {
      return false;
    } else {
      await sheet.addRow({ client_name: inputs.name, phone: inputs.phone });
      return true;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating a new user", error.message);
      return false;
    }
  }
}
