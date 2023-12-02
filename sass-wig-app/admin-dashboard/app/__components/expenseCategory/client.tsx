import DefaultHeader from '@/components/ui/default-header'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '../datatable/data-table'
import { ExpenseCategoryColumn, expenseCategoryColumns } from './columns'

const ExpenseCategoryClient = ({ data, storeId }: { data: ExpenseCategoryColumn[], storeId: string }) => {

  return (
    <>
      <DefaultHeader data={data} storeId={storeId as string} title='Expense categories' url='expenseCategory/new' />
      <Separator />
      <DataTable searchKey='name' columns={expenseCategoryColumns} data={data} />
    </>
  )
}

export default ExpenseCategoryClient