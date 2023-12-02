"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"
import { deleteAppointment } from "@/actions/appointment-actions"
import TitleLink from "../datatable/title-link"

export type AppointmentColumns = {
    id: string
    unit: string
    name: string,
    services: string,
    status: string,
    time: string,
    date: string,
    orderId?: string
  }
  
export const appointmentColumns: ColumnDef<AppointmentColumns>[] = [
    {
      accessorKey: "name",
      header: "Client name",
      cell: ({ row }) => <TitleLink id={row.original.orderId as string} name={row.original.name} url="orders/details" status={row.original.status} />
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "services",
      header: "Service",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="appointments" view="orders/details" delFunction={deleteAppointment} />
    }
]
  