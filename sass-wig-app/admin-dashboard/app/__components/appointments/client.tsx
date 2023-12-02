import DefaultHeader from '@/components/ui/default-header'
import { DataTable } from '../datatable/data-table'

import { AppointmentColumns, appointmentColumns } from './columns'
import { Separator } from '@/components/ui/separator'

const AppointmentClient = ({ data, storeId }: { data: (AppointmentColumns & {orderId: string })[], storeId: string }) => {
  
  return (
     <>
      <DefaultHeader title='Appointments' data={data} storeId={storeId} url='appointments/new' settings='orderCategory'/>
      <Separator />
      <DataTable columns={appointmentColumns} data={data} searchKey='name' monthSort orderSort statusSort
      statusType='appointment' />
     </>
  )
}

export default AppointmentClient