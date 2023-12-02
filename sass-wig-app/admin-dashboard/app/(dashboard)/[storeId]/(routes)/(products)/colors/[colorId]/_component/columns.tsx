"use client"

import { deleteColor } from "@/actions/color-actions"
import CellAction from "@/app/__components/datatable/cell-action"
import { ColumnDef } from "@tanstack/react-table"

export type ColorColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}
  
export const colorColumns: ColumnDef<ColorColumn>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => <div className="flex items-center gap-x-1c">
        <div className="h-6 w-6 rounded-full border border-gray-300"  style={{ backgroundColor: row.original.value }}/>
        {row.original.value}
      </div>
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="colors" delFunction={deleteColor}  />
    }
]
  