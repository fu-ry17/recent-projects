import { expenseCategoryTotal, getExpenseCategories } from '@/actions/expense-category-actions'
import Wrapper from '@/app/__components/customs/wrapper'
import CalcExpenseCategory from '@/app/__components/expenseCategory/calc-expense-category'
import ExpenseCategoryClient from '@/app/__components/expenseCategory/client'
import { Separator } from '@/components/ui/separator'

const ExpenseCategory = async({ params }: { params: { storeId: string }}) => {
  const expensesCategories = await getExpenseCategories(params.storeId)
  const response = await expenseCategoryTotal(params.storeId)

  return (
    <Wrapper>
        <CalcExpenseCategory data={response?.result || []} total={response?.totalAmount || 0} />
        <Separator />
        <ExpenseCategoryClient data={expensesCategories} storeId={params.storeId} />
    </Wrapper>
  )
}

export default ExpenseCategory