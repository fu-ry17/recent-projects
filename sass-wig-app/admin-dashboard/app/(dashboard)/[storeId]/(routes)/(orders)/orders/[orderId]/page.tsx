import Wrapper from '@/app/__components/customs/wrapper'
import { OrderForm } from '@/app/__components/order/order-form'
import prismadb from '@/lib/prisma'
import { formatCategory } from '@/lib/utils'

const OrderCreateUpdate =  async ({ params} : { params: { orderId: string, storeId: string  }}) => {
  const order = await prismadb.order.findUnique({ where: { storeId: params.storeId, id: params.orderId }, 
     include: { orderCategories: true }
  }) 
  const orderCategories = await prismadb.orderCategory.findMany({ where: { storeId: params.storeId }})

  return (
    <Wrapper>
       <OrderForm storeId={params.storeId} initialData={order} formattedOrderCategory={formatCategory(orderCategories) || []} />
    </Wrapper>
  )
}

export default OrderCreateUpdate