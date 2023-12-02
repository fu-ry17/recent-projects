import Wrapper from '@/app/__components/customs/wrapper'
import { ExpenseCategoryForm } from '@/app/__components/expenseCategory/ec-form'
import prismadb from '@/lib/prisma'
import React from 'react'

const ExpenseCategoryCreateUpdate = async ({ params} : { params: { ecparams: string, storeId: string  }}) => {
  const expenseCategory = await prismadb.expenseCategory.findUnique({ where: { id: params.ecparams, storeId: params.storeId }})

  return (
     <Wrapper>
        <ExpenseCategoryForm initialData={expenseCategory} storeId={params.storeId} />
     </Wrapper>
  )
}

export default ExpenseCategoryCreateUpdate