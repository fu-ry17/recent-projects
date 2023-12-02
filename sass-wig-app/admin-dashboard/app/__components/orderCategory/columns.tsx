"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"
import { deleteOrderCategory } from "@/actions/order-category-actions"

export type OrderCategoryColumn = {
    id: string
    name: string
    appointmentUse: boolean
    commissionAmount: string
  }
  
export const orderCategoryColumns: ColumnDef<OrderCategoryColumn>[] = [
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => <h1 className="capitalize">{row.original.name}</h1>
    },
    {
      accessorKey: "appointmentUse",
      header: "Appointment"
    },
    {
      accessorKey: "commissionAmount",
      header: "Comission"
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="orderCategory" delFunction={deleteOrderCategory}  />
    }
]
  