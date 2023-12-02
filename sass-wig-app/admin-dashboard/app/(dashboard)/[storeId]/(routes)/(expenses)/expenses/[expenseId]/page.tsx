import { getExpense } from '@/actions/expense'
import Wrapper from '@/app/__components/customs/wrapper'
import { ExpenseForm } from '@/app/__components/expenses/expense-form'
import prismadb from '@/lib/prisma'
import React from 'react'

const ExpenseCreateUpdate = async({ params  }: { params: {expenseId: string, storeId: string }} ) => {
  const expense = await getExpense(params.expenseId, params.storeId)
  const expenseCategories = await prismadb.expenseCategory.findMany({ where: { storeId: params.storeId }})

  return (
    <Wrapper>
        <ExpenseForm initialData={expense} expenseCategories={expenseCategories} storeId={params.storeId}/>
    </Wrapper>
  )
}

export default ExpenseCreateUpdate