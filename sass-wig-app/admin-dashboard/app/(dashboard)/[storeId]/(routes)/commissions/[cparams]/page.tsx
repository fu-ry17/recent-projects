import { getCommission } from '@/actions/commission-actions'
import { CommissionForm } from '@/app/__components/commissions/c-form'
import Wrapper from '@/app/__components/customs/wrapper'
import prismadb from '@/lib/prisma'
import { formatCategory } from '@/lib/utils'

const ComissionCreateUpdate = async({ params }: { params: { storeId: string, cparams: string }}) => {
   const orderCategories = await prismadb.orderCategory.findMany({ where: { storeId: params.storeId }})
   const initialData = await getCommission(params.cparams, params.storeId)

  return (
    <Wrapper>
        <CommissionForm initialData={initialData} storeId={params.storeId} formattedOrderCategory={formatCategory(orderCategories) || []} />
    </Wrapper>
  )
}

export default ComissionCreateUpdate