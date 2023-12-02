import { getOrders } from "@/actions/order-ations"
import Wrapper from "@/app/__components/customs/wrapper"
import OrderClient from "@/app/__components/order/client"

const OrdersPage = async ({ searchParams,  params }: { searchParams: any, params: { storeId: string }}) => {
  const orders = await getOrders(params.storeId, searchParams)

  return (
    <Wrapper>
       <OrderClient orders={orders} storeId={params.storeId} />
    </Wrapper>
  )
}

export default OrdersPage