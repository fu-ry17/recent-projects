import { getOrderCatgories } from '@/actions/order-category-actions'
import Wrapper from '@/app/__components/customs/wrapper'
import OrderCategoryClient from '@/app/__components/orderCategory/client'

const OrderCategory = async({ params }: { params: { storeId: string } }) => {
  const orderCategory = await getOrderCatgories(params.storeId)

  return (
    <Wrapper>
        <OrderCategoryClient data={orderCategory} storeId={params.storeId} />
    </Wrapper>
  )
}

export default OrderCategory