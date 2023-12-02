import { getOrderCatgory } from '@/actions/order-category-actions'
import Wrapper from '@/app/__components/customs/wrapper'
import { OrderCategoryForm } from '@/app/__components/orderCategory/oc-form'

const OrderCategoryCreateUpdate = async ({ params} : { params: { ocparams: string, storeId: string  }}) => {
  const orderCategory = await getOrderCatgory(params.storeId, params.ocparams)

  return (
     <Wrapper>
        <OrderCategoryForm initialData={orderCategory} storeId={params.storeId} />
     </Wrapper>
  )
}

export default OrderCategoryCreateUpdate