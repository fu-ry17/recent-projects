import { getExpenses } from "@/actions/expense"
import Wrapper from "@/app/__components/customs/wrapper"
import ExpensesClient from "@/app/__components/expenses/client"

const ExpensesPage = async({ searchParams, params }: { searchParams: any, params: { storeId: string }}) => {
  const data = await getExpenses(params.storeId, searchParams)

  return (
     <Wrapper>
        <ExpensesClient storeId={params.storeId} data={data} />
     </Wrapper>
  )
}

export default ExpensesPage