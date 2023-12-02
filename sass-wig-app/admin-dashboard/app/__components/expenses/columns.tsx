"use client"

import { deleteExpense } from "@/actions/expense"
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"
import TitleLink from "../datatable/title-link"

export type ExpenseColumns = {
    id: string
    title: string,
    category: string
    amount: string,
    createdAt: string
  }
  
export const expenseColumns: ColumnDef<ExpenseColumns>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <TitleLink id={row.original.id} name={row.original.title} url="expenses/details" />
    },
    {
     accessorKey: "amount",
      header: "Amount",
    },
    {
       accessorKey: "category",
       header: "Category",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="expenses" delFunction={deleteExpense} view="expenses/details"  />
    }
]
  
export const mobileExpenseColumns: ColumnDef<ExpenseColumns>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <TitleLink id={row.original.id} name={row.original.title} url="expenses/details" />
  },
  {
   accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} url="expenses" delFunction={deleteExpense} view="expenses/details"  />
  }
]
