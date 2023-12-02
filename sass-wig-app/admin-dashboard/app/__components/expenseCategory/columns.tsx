"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"
import { deleteExpenseCategory } from "@/actions/expense-category-actions"

export type ExpenseCategoryColumn = {
    id: string
    name: string
    createdAt: string
}
  
export const expenseCategoryColumns: ColumnDef<ExpenseCategoryColumn>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="expenseCategory" delFunction={deleteExpenseCategory}  />
    }
]
  