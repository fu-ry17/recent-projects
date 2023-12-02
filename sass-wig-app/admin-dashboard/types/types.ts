export {};

declare global {
  interface Window {
    workbox?: any
  }
}

export interface INotification{ message: string, title: string, url?: string}

export type IOverview = {
  month: string;
  count: number;
  totalAmount: number;
}

export type ResponseObject = {
    msg?: string,
    error?: string
}

export type IOrderCategory = {
  comissionAmount: number;
  storeAmount: number;
  nonStoreAmount: number;
  id: string;
  name: string;
  appointmentUse: boolean;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
}

export type IOldOrder = {
  id: string;
  name: string;
  unit: string;
  amountPaid: string;
  balance: string;
  quantity: string;
  category: string;
  headSize: string;
  status: string;
  note: string;
  paymentMethod: string;
  phone: string;
  month: string;
  year: string;
  url: string;
  referenceId: string;
  createdAt: string;
  updatedAt: string;
};


export type IOrderResponse = {
  revenue: string
  percentage: string
  status: string
  name: string
}

export type IFormattedOrder = {
  id: string,
  name: string,
  phone: string,
  paymentMethod: string,
  categories: string;
  unit: string;
  amountPaid: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
  appointmentId: string | null;
  time: string | undefined;
  date: string | undefined;
  storeId: string;
  headSize: string | null;
  note: string | null
  storeName: string
  status: string
  unitType: string | undefined
}