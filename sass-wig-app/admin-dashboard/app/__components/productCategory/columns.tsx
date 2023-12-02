"use client"

import { deleteProductCategory } from "@/actions/product-category-actions"
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"

export type ProductCategoryColumn = {
    id: string
    name: string
    createdAt: string
}
  
export const productCategoryColumns: ColumnDef<ProductCategoryColumn>[] = [
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
      cell: ({ row }) => <CellAction data={row.original} url="productCategory" delFunction={deleteProductCategory}  />
    }
]
  