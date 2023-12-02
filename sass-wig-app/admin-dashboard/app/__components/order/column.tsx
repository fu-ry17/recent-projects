"use client"

import { deleteOrder } from "@/actions/order-ations"
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"
import TitleLink from "../datatable/title-link"

export type OrderColumns = {
    id: string
    name: string,
    unit: string,
    status?: string
    category: string
    amountPaid: string
    balance: string
    createdAt: string
}

export type MobileOrderColumns = {
  id: string
  name: string,
  unit: string,
  status?: string
  amountPaid: string
  createdAt: string
}
  
export const orderColumns: ColumnDef<OrderColumns>[] = [
    {
      accessorKey: "name",
      header: "Client name",
      cell: ({ row }) => <TitleLink id={row.original.id} name={row.original.name} url="orders/details" status={row.original.status} />
    },
    {
      accessorKey: "unit",
      header: "Unit(s)",
    },
    {
      accessorKey: "amountPaid",
      header: "Amount Paid",
    },
    {
       accessorKey: "balance",
       header: "Balance",
    },
    {
       accessorKey: "category",
       header: "Category(s)", 
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="orders" delFunction={deleteOrder} view="orders/details"  />
    }
]

export const mobileOrderColumns: ColumnDef<MobileOrderColumns>[] = [
  {
    accessorKey: "name",
    header: "Client name",
    cell: ({ row }) => <TitleLink id={row.original.id} name={row.original.name} url="orders/details" status={row.original.status} />
  },
  {
    accessorKey: "unit",
    header: "Unit(s)",
  },
  {
    accessorKey: "amountPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },

//   fix delfunction
  {
    id: "actions", 
    cell: ({ row }) => <CellAction data={row.original} url="orders" delFunction={deleteOrder} view="orders/details"  />
  }
]