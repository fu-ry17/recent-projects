import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { CalcExpenseCategoryType } from '@/types/expenseTypes'
import CalExpenseCard from './calc-expense-card'
import BackComponent from '../customs/back-component'

const CalcExpenseCategory = ({ data, total }: { data: CalcExpenseCategoryType[] | [], total: number }) => {
  return (
    <div>
      <div>
        <BackComponent showText />
        <div className='pb-2'></div>
        <Heading title="Expense categories total" description="Expense-categories total calculated monthly" />
      </div>
  
      <div className='py-2'></div>
      <Separator />

      {
        data.length > 0 ? <CalExpenseCard data={data} total={total} /> : 
        <div className='flex items-center justify-center'> 
            <p className='pb-4 pt-6'> No results found! </p>  
        </div>
      }

    </div>
  )
}

export default CalcExpenseCategory