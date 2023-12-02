import { getOrder } from '@/actions/order-ations'
import OrderDetailClient from './_component/client'
import Wrapper from '@/app/__components/customs/wrapper'

const OrderDetails = async ({
    params
}: { params: { slug: string, storeId: string }}) => {
  const order = await getOrder(params.slug, params.storeId)

  if(!order) return <h1> No order found</h1>

  return (
    <Wrapper>
        <OrderDetailClient order={order} storeId={params.storeId} />
    </Wrapper>
  )
}

export default OrderDetails