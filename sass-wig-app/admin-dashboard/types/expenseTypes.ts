import { ExpenseColumns } from "@/app/__components/expenses/columns";
import { OrderColumns } from "@/app/__components/order/column";
import { ExpenseCategory, ExpenseImage } from "@prisma/client";

export type IExpenseSheet = {
    id: string;
    title: string;
    amount: string;
    reference: string;
    month: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    category: string;
    recieptUrl: string
}

export type CalcExpenseCategoryType = {
    id: string | undefined;
    category: string | undefined;
    totalCount: number;
    totalAmount: number;
}

export type IExpense = {
    id: string;
    title: string;
    amount: number;
    reference: string;
    month: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    expenseCategoryId: string;
    expenseImages: ExpenseImage[]
    expenseCategory: ExpenseCategory
    storeId: string;
}

// move to types folder
export interface TodayExpenseType {
    totalAmount: string;
    formattedExpenses: ExpenseColumns[]
}


export interface TodayOrderType {
    totalAmount: string;
    formattedOrders: OrderColumns[]
}
