import DefaultHeader from '@/components/ui/default-header'
import { DataTable } from '../datatable/data-table'
import { Separator } from '@/components/ui/separator'
import { ExpenseColumns, expenseColumns, mobileExpenseColumns } from './columns'


const ExpensesClient = ({ data, storeId }: { data: ExpenseColumns[], storeId: string }) => {

  return (
    <>
      <DefaultHeader data={data} storeId={storeId as string} title='Expenses' url='expenses/new'
      settings='expenseCategory' />
      <Separator />
      
      {/* display on desktop */}
      <div className='w-full hidden md:block'>
         <DataTable searchKey='title' columns={expenseColumns} data={data} monthSort orderSort />
      </div>
     
      {/* display on mobile */}
      <div className='w-full block md:hidden'>
         <DataTable searchKey='title' columns={mobileExpenseColumns} data={data} monthSort orderSort />
      </div>

    </>
  )
}

export default ExpensesClient