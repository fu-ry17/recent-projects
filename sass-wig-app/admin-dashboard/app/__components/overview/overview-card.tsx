import React from 'react'
import { ExpenseColumns, expenseColumns } from '../expenses/columns'
import { DataTable } from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

interface InitialDataProps {
    title: string, 
    searchKey: string,
    initialData: ExpenseColumns[], 
    totalAmount: string, 
    columns: ColumnDef<ExpenseColumns>[]
    className: string
}

const OverViewCard = ({ 
    initialData, totalAmount, columns, title, searchKey, className
 }: InitialDataProps ) => {
  return (
    <div className={className}>
        <Heading
          title={`Today's ${title} (${initialData.length})`} 
          description={`view today's ${title.toLowerCase()} and total amount spent`}
        />

        <Separator />
        <DataTable data={initialData}  columns={columns} searchKey={searchKey}  />
        <h1 className='font-bold mb-3'>Total: {totalAmount}</h1>

        <Separator />

    </div>
  )
}

export default OverViewCard