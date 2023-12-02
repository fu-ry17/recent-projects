"use server"
import prismadb from "@/lib/prisma"
import { convertToNumber, createUniqueCategories } from "@/lib/sheet-info"
import { delay, formatCategory, formatter } from "@/lib/utils"
import { ImageInput } from "@/types/imageInput"
import { ResponseObject } from "@/types/types"
import { sheetDB } from "@/utils/sheetConfig"
import { convertImagesToString } from "@/utils/sheetExpenses"
import { getSheetData } from "@/utils/sheetSyncAction"
import { auth } from "@clerk/nextjs"
import { Store } from "@prisma/client"
import _ from "lodash"
import { syncCreateOrder } from "./order-ations"
import { uploadToCloudinaryServer } from "./uploadPhoto"
import { syncCreateExpense } from "./expense"

export const configureGoogleSheet = async(data: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }

        await prismadb.store.update({ 
            where: { id: storeId }, data: { sheet: data }
        })

        return { msg: "Google sheet configured successfully"}
        
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message)
            return { error: "Something went wrong could not complete process"}
        }
        return { error: "An unexpected error occurred" }
    }
}

// works perfectly
export const createUniqueExpenseOrderCategories = async (store: Store) => {
  try {
      // Get old orders data and old expenses data concurrently
      const [ordersResult, expensesResult] = await Promise.all([
          getSheetData('old-orders', store),
          getSheetData('old-expenses', store),
      ])

      const handleData = async (data: any, isExpense: boolean) => {
          if (data?.data) {
              await createUniqueCategories(data.data, store.id, isExpense);
          }
      };

      await Promise.all([
          handleData(ordersResult.response, false),
          handleData(expensesResult.response, true),
      ]);

      return { msg: "Categories created!" };
  } catch (error: any) {
      console.error(`CREATE_CATEGORIES_SYNC`, error.message);
      return { error: 'Something went wrong, could not sync data' };
  }
}

const year = new Date().getFullYear()
const sheetTitle = `Orders-${year}`
export const syncToGoogleSheet = async (store: Store): Promise<ResponseObject> => {
  try {
    const orders = await prismadb.order.findMany({
      where: { storeId: store.id },
      include: { orderCategories: true },
      orderBy: { createdAt: "asc"}
    });

    // Transform orders into the expected format
    const data = orders.map((o) => {
      const orderData = { ...o, categories: o.orderCategories.map((oc) => oc.name).join(',') };
      const postData = _.omit(orderData, ['orderCategories']);
      return {
        id: postData.id,
        name: postData.name,
        unit: postData.unit as string,
        phone: postData.phone as string,
        amountPaid: formatter.format(parseFloat(String(postData.amountPaid))).toLowerCase(),
        balance: formatter.format(parseFloat(String(postData.balance))).toLowerCase(),
        categories: postData.categories,
        status: postData.status,
        headSize: postData.headSize as string,
        note: postData.note ? postData.note : "null",
        month: postData.month,
        year: postData.year,
        createdAt: new Date(postData.createdAt).toLocaleDateString('en-US'),
        updatedAt: new Date(postData.updatedAt).toLocaleDateString('en-US')
      };
    });

    const doc = await sheetDB(store);
    if (!doc) return { error: "Sheet not configured" };

    let sheet = doc.sheetsByTitle[sheetTitle];

    if (!sheet) {
      sheet = await doc?.addSheet({ title: sheetTitle });
      const excludeKeys: string[] = ["storeId", "appointmentId"];
      const headers: string[] = Object.keys(data[0]).filter((k) => !excludeKeys.includes(k));
      await sheet?.setHeaderRow(headers);
    }

    await sheet.addRows(data.map((order) => Object.values(order)));

    return { msg: 'Order sync successful..' };
  } catch (error) {
    if (error instanceof Error) {
      console.log(`OLD_ORDER_SYNC`, error.message);
      return { error: 'Something went wrong, could not sync data' };
    }

    return { error: 'An unexpected error occurred' };
  }
} // updated to add phone number

const expenseSheetTitle = `Expenses-${year}`
export const syncExpensesGoogleSheet = async (store: Store): Promise<ResponseObject> => {
  try {
    const orders = await prismadb.expense.findMany({
      where: { storeId: store.id },
      include: { expenseCategory: true, expenseImages: true },
      orderBy: { createdAt: "asc"}
    });

    // Transform orders into the expected format
    const data = orders.map((e) => {
      return {
        id: e.id,
        title: e.title,
        amount: formatter.format(parseFloat(String(e.amount))).toLocaleLowerCase(), 
        reference: e.reference,
        category: e.expenseCategory.name,
        recieptUrl: e.expenseImages.length > 0 ? convertImagesToString(e.expenseImages) : "null",
        month: e.month,
        year: e.year,
        createdAt: new Date(e.createdAt).toLocaleDateString('en-US'),
        updatedAt: new Date(e.updatedAt).toLocaleDateString('en-US')
      }
    })

    const doc = await sheetDB(store);
    if (!doc) return { error: "Sheet not configured" };

    let sheet = doc.sheetsByTitle[expenseSheetTitle];

    if (!sheet) {
      sheet = await doc?.addSheet({ title: expenseSheetTitle });
      const excludeKeys: string[] = ["storeId", "appointmentId"];
      const headers: string[] = Object.keys(data[0]).filter((k) => !excludeKeys.includes(k));
      await sheet?.setHeaderRow(headers);
    }

    await sheet.addRows(data.map((order) => Object.values(order)));

    return { msg: 'Expense sync successful..' };
  } catch (error) {
    if (error instanceof Error) {
      console.log(`OLD_EXPENSE_SYNC`, error.message);
      return { error: 'Something went wrong, could not sync data' };
    }

    return { error: 'An unexpected error occurred' };
  }
}

// client and contact sync
const clientContactTitle = ``
export const syncClientAndContactGoogleSheet = async(store: Store): Promise<ResponseObject> => {
  try {
    const orders = await prismadb.order.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "asc"}
    })

    const data = orders.map(o => ({
       client_name: o.name, phone: o.phone
    }))

    console.log({ data })

    return { msg: 'Client contacts sync successful..' };

  } catch (error) {
    if (error instanceof Error) {
      console.log(`CLIENT_CONTACT_SYNC`, error.message)
      return { error: 'Something went wrong, could not sync data' }
    }

    return { error: 'An unexpected error occurred' }
  }
}

export const syncOldOrders = async (store: Store): Promise<ResponseObject> => {
    try {
      const { response, error } = await getSheetData('old-orders', store);
      if (error) return { error };

      if(response?.data){
        const size = 100;
        const dataChunks = [];

        for (let i = 0; i < response.data.length; i += size) {
            dataChunks.push(response.data.slice(i, i + size));
        }
        
        // 5 seconds delay between each sync
        const delayBetweenChunksMs = 5000
    
        for (const chunk of dataChunks) {
            await syncDataChunk(chunk, store)
            await delay(delayBetweenChunksMs)  // delay between chunks
        }

      }

      return { msg: 'Expenses sync successful' };

    } catch (error) {
      if (error instanceof Error) {
        console.log(`OLD_EXPENSE_SYNC`, error.message);
        return { error: 'Something went wrong, could not sync data' };
      }
  
      return { error: 'An unexpected error occurred' };
    }
}
  
// Utility function to sync a data chunk
const syncDataChunk = async(chunk: any[], store: Store) => {
    for (const o of chunk) {
      const orderData = _.omit(o, ['referenceId', 'id', 'category', 'url']);
      const orderCategory = await prismadb.orderCategory.findFirst({
        where: { name: o.category.toLowerCase().replace(/ /g, '-'), storeId: store.id },
      })
  
      if (orderCategory) {
        const formattedOrderCategory = formatCategory([orderCategory]);
        const { error } = await syncCreateOrder({
          ...orderData, amountPaid: convertToNumber(orderData.amountPaid),
          balance: convertToNumber(orderData.balance), quantity: parseInt(orderData.quantity),
          paymentMethod: o.paymentMethod.toLowerCase(), month: orderData.month,
          categories: formattedOrderCategory, year: parseInt(orderData.year),
          createdAt: new Date(orderData.createdAt), updatedAt: new Date(orderData.updatedAt),
        } as any, store.id);
  
        if (error) {
          console.error(`Error creating one or more orders: ${error}`);
          return { error: "Somthing went wrong during orders sync" }
        }
      }
    }
}

export const syncOldExpenses = async (store: Store): Promise<ResponseObject> => {
  try {
    const { response, error } = await getSheetData('old-expenses', store);
    if (error) return { error };

    if(response?.data){
      const size = 40 // because of image uploads
      const dataChunks = [];

      for (let i = 0; i < response.data.length; i += size) {
          dataChunks.push(response.data.slice(i, i + size));
      }
  
      // Iterate through data chunks and sync them with a delay
      const delayBetweenChunksMs = 5000; // 5 seconds
  
      for (const chunk of dataChunks) {
          await syncExpenseDataChunk(chunk, store);
          // delay between chunks
          await delay(delayBetweenChunksMs);
      }

    }

    return { msg: 'Order sync successful' };

  } catch (error) {
    if (error instanceof Error) {
      console.log(`OLD_EXPENSE_SYNC`, error.message);
      return { error: 'Something went wrong, could not sync data' };
    }

    return { error: 'An unexpected error occurred' };
  }
}

// Utility function to sync a data chunk
const syncExpenseDataChunk = async (chunk: any[], store: Store) => {
  for (const e of chunk) {
    const { referenceId, id, url, ...expenseData } = e;
    const categorySlug = e.category.toLowerCase().replace(/ /g, '-');
    const expenseCategory = await prismadb.expenseCategory.findFirst({
      where: { name: categorySlug, storeId: store.id },
    });

    if (expenseCategory) {
      let imageArr: ImageInput[] = [];

      if (url !== undefined && url !== "null") {
        try {
          const photos = await uploadToCloudinaryServer([url], store.id);

          if (photos && photos.length > 0) {
            // Check if url is not undefined before mapping
            imageArr = photos.filter((p) => p?.secure_url && p?.public_id)
              .map((p) => ({
                url: p?.secure_url as string,
                referenceId: p?.public_id as string,
              }));
          }
        } catch (uploadError) {
          console.error(`Error uploading to Cloudinary: ${uploadError}`);
          imageArr = [];
        }
      }

      const expenseCreationData = {
        ...expenseData,
        amount: convertToNumber(expenseData.amount),
        category: expenseCategory.id,
        reference: expenseData.reference,
        month: expenseData.month,
        year: parseInt(expenseData.year),
        createdAt: new Date(expenseData.createdAt),
        updatedAt: new Date(expenseData.updatedAt),
        images: imageArr,
      } as any;

      try {
        const { error } = await syncCreateExpense(expenseCreationData, store.id);

        if (error) {
          console.error(`Error creating one or more expenses: ${error}`);
          // Handle the error if needed
        }
      } catch (expenseCreationError) {
        console.error(`Error creating one or more expenses: ${expenseCreationError}`);
      }
    }
  }
}

