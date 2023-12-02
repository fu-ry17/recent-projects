import { getExpense } from "@/actions/expense"
import ExpenseDetailClient from "./_component/client"
import Wrapper from "@/app/__components/customs/wrapper"

const ExpenseDetails  = async({ params }: { params: { slug: string, storeId: string }}) => {
  const expense = await getExpense(params.slug, params.storeId)

  if(!expense) return <h1> No expense found! </h1>

  return (
    <Wrapper>
       <ExpenseDetailClient expense={expense} storeId={params.storeId} />
    </Wrapper>
  )
}

export default ExpenseDetails 