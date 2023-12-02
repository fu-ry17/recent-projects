import { IFormattedOrder } from '@/types/types'

const AppointmentCard = ({ order }: { order: IFormattedOrder}) => {
  return (
    <div>
       <div className='flex justify-between flex-wrap gap-4 my-3'>
          <p> Unit Type: {order.unitType === "store" ? order.storeName : `Non-${order.storeName}`} </p>
          <p> Time: {order.time}</p>
       </div>
       <p className='mb-3'> Appointment Date: {order.date} </p>
    </div>
  )
}

export default AppointmentCard