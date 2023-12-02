import { sheetSchema } from '@/lib/schema';
import { decryptKeys } from '@/lib/utils';
import { Store } from '@prisma/client';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as z from 'zod';

export const sheetDB = async (store: Store) => {
    try {
        const data: z.infer<typeof sheetSchema> = JSON.parse(decryptKeys(store.sheet as string));
        const privateKey = (data.sheetSecret as string).slice(1, -1).replace(/\\n/g, '\n')

        const serviceAccountAuth = new JWT({
            email: data.sheetClient as string,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(data.sheetId as string, serviceAccountAuth);

        await doc.loadInfo();
        await doc.updateProperties({ title: store.name });

        return doc
      
    } catch (error) {
        if(error instanceof Error){
            console.error("Error:", error.message); // only in dev
            return
        }
    }
};
