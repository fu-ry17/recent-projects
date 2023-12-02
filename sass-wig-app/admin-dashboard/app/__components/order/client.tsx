import DefaultHeader from '@/components/ui/default-header'
import { DataTable } from '../datatable/data-table'

import { Separator } from '@/components/ui/separator'
import { OrderColumns, mobileOrderColumns, orderColumns } from './column'

const OrderClient = ({ storeId, orders }: { storeId: string, orders: OrderColumns[] }) => {
  return (
    <>
       <DefaultHeader data={orders} storeId={storeId as string} title='Orders' url='orders/new'
         settings='orderCategory' />
       <Separator />

      {/* display on desktop */}
      <div className='w-full hidden md:block'>
        <DataTable columns={orderColumns} data={orders} searchKey='name' orderSort monthSort statusSort
        statusType='orders' />
      </div>
     
      {/* display on mobile */}
      <div className='w-full block md:hidden'>
      <DataTable columns={mobileOrderColumns} data={orders} searchKey='name' orderSort monthSort statusSort
       statusType='orders' />
      </div>
    </>
  )
}

export default OrderClient