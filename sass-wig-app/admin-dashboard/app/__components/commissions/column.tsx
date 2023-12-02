import { deleteCommission } from "@/actions/commission-actions"
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "../datatable/cell-action"
import TitleLink from "../datatable/title-link"


export type CommissionColumn = {
    id: string
    name: string
    unit: string
    service: string,
    amount: string
    date: string
    paid: boolean
}

export type WeeklyColumn = {
  name: string
  value: string
  date: string,
}

export const commissionColumns: ColumnDef<CommissionColumn>[] = [
    {
      accessorKey: "name",
      header: "Employee name",
      cell: ({ row }) => <TitleLink
       id={row.original.id} name={row.original.name} status={row.original.paid === false ? 'cpending' : 'delivered'} paid={!row.original.paid}
      />
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "service",
      header: "Service(s)",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="commissions" delFunction={deleteCommission} />
    }
]
  
export const mobileCommissionColumns: ColumnDef<CommissionColumn>[] = [
    {
      accessorKey: "name",
      header: "Employee name",
      cell: ({ row }) => <TitleLink
          id={row.original.id} name={row.original.name} status={row.original.paid === false ? 'cpending' : 'delivered'} paid={!row.original.paid}
      />
    },
    {
      accessorKey: "service",
      header: "Service(s)",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} url="commissions" delFunction={deleteCommission} />
    }
]

export const weeklyCommissionColumns: ColumnDef<CommissionColumn>[] = [
  {
    accessorKey: "name",
    header: "Employee name",
  },
  {
    accessorKey: "value",
    header: "Amount",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
]
