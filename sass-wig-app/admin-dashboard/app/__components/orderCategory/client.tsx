import { Separator } from "@/components/ui/separator"
import { OrderCategoryColumn, orderCategoryColumns } from "./columns"
import { DataTable } from "../datatable/data-table"
import DefaultHeader from "@/components/ui/default-header"
import BackComponent from "../customs/back-component"

const OrderCategoryClient = ({ data, storeId }: { storeId: string, data: OrderCategoryColumn[] }) => {

  return (
    <>
     <BackComponent showText />
     <DefaultHeader data={data} storeId={storeId as string} title='Order categories' url='orderCategory/new' />
      <Separator />
      <DataTable searchKey='name' columns={orderCategoryColumns} data={data} />
    </>
  )
}

export default OrderCategoryClient