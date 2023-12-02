// import { OrderCategory } from "@prisma/client";
import { CommissionColumn } from "@/app/__components/commissions/column";
import { ExpenseCategory, OrderCategory } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
const crypto = require('crypto-js')
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: "kes"
});

export const validImage = (file: File) => {
  if(!file){
      return ({ msg: 'No file has been uploaded'})
  }

  if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg'){
      return ({ msg: 'File format is not supported!'})
  }

  if(file.size > 1024 * 1024 * 4){ // 4 mb
      return ({ msg: 'The file is too large'})
  }

}

let key = process.env.NEXT_PUBLIC_ENCRYPT_KEY as string;

export const encryptKeys = (text: string) => {
    return crypto.AES.encrypt(text, key).toString()
}

export const decryptKeys = (text: string) => {
    var bytes  = crypto.AES.decrypt(text, key);
    var originalText = bytes.toString(crypto.enc.Utf8)
    return originalText
}

export const formatCategory = (orderCategories: OrderCategory[] | ExpenseCategory[]) => {
  const formattedOrderCategory = orderCategories?.map(o => ({
      value: o?.id, label: o?.name
  }))

  return formattedOrderCategory
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getWeeksInMonth = (year: number, month: number, date: Date): number => {
  // Create a Date object for the first day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1);

  // Calculate the week number for the given date
  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil((dayOfMonth + firstDayOfMonth.getDay()) / 7);

  return weekNumber;
}

// only fixed to work with commission
// export const groupDataByWeek = (year: number, month: number, data: CommissionColumn[]): Record<string, any[] | CommissionColumn[]> => {
//   const groupedData: Record<string, CommissionColumn[]> = {};

//   data.forEach((item) => {
//     const week = getWeeksInMonth(year, month, new Date(item.date));
//     const weekKey = `Week ${week}`;

//     if (!groupedData[weekKey]) {
//       groupedData[weekKey] = [];
//     }

//     groupedData[weekKey].push(item);
//   });

//   return groupedData;
// }

export const groupDataByWeek = (year: number, month: number, data: CommissionColumn[]): Record<string, any> => {
  const groupedData: Record<string, any> = {};

  data.forEach((item) => {
    const week = getWeeksInMonth(year, month, new Date(item.date));
    const weekKey = `Week ${week}`;

    if (!groupedData[weekKey]) {
      groupedData[weekKey] = {
        commissions: [], totalCommission: 0,
      }
    }

    groupedData[weekKey].commissions.push(item)
    groupedData[weekKey].totalCommission += parseFloat(item.amount.replace(/[^\d.]/g, ''))

  })

  return groupedData;
}



// api keys
export const encryptApiKey = (text: string, secure_key: string) => {
  return crypto.AES.encrypt(text, secure_key).toString()
}

export const decryptApiKey = (text: string, secure_key: string) => {
  var bytes  = crypto.AES.decrypt(text, secure_key);
  var originalText = bytes.toString(crypto.enc.Utf8)
  return originalText
}