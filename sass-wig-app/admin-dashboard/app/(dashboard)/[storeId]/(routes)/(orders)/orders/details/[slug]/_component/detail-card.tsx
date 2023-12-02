"use client"
import { completeOrder } from '@/actions/order-ations'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { IFormattedOrder } from '@/types/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AppointmentCard from './appointment-card'
import React, { Dispatch, SetStateAction } from 'react'
import { Loader2 } from 'lucide-react'

const DetailCard = ({ order, storeId, setLoading, loading, componentRef, }: { 
  order: IFormattedOrder, storeId: string, setLoading: Dispatch<SetStateAction<boolean>>,
  loading: boolean, componentRef: React.MutableRefObject<null>
}) => {
  const router = useRouter()

  return (
  <div className={`mt-4`} ref={componentRef}>

    <Heading title={order.storeName} description={order.id} />
    <div className='mb-3'></div>
    <Separator />

    <h1 className='my-3 text-xl font-semibold tracking-wider capitalize'>{order.name}</h1>
    <h2 className='my-3'>Unit: {order.unit}</h2>
    <h3 className='my-3'>Phone: {order.phone.startsWith('+') ? `${order.phone}` : `+${order.phone}`}</h3>
    <h4 className='my-3'>Payment Method: {order.paymentMethod}</h4>

    { order.appointmentId ? <AppointmentCard order={order} /> : null }

    <div className='flex justify-between flex-wrap gap-4'>
      <p className="capitalize"> Paid: {order.amountPaid}</p>
      { order.balance ? <h4> Balance: {order.balance}</h4> : null}
    </div> 

    <div className='flex justify-between flex-wrap gap-4 my-2'>
      <p className="capitalize"> Head size : {order.headSize}</p>
      <p> { order.appointmentId ? `Service(s)` : `Category(s)`} : {order.categories}</p> 
    </div>

    <div className='flex justify-between flex-wrap gap-2'>
    <p> Ordered On : {order.createdAt}</p>
    { order.status === "delivered" ? <p> Delivered On : {order.updatedAt} </p> : null }
    </div> 

    { order.note ? <p className='my-3'> Note : {order.note} </p> : null }

    <p className='font-semibold my-3 text-xl tracking-wide'>  
      Total: {order.amountPaid}
    </p>
    
    <Button
      disabled={loading}
      className={`w-full md:max-w-xs mt-3 text-white mb-8 md:mb-6 ${
        order.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600'
          : order.status === 'refund' ? 'bg-gray-500 hover:bg-gray-600'
          : order.status === 'delivered' ? 'bg-green-500 hover:bg-green-600'
          : order.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600'
          : 'bg-gray-400 hover:bg-gray-500'
      }`}
      onClick={async () => {
        try {
          setLoading(true)
          const { error, msg } = await completeOrder(order.id, storeId);
          if (error) {
            toast.error(error);
          } else if (msg) {
            toast.success(msg);
            router.refresh();
          }
        } catch (error) {
          toast.error("Something went wrong, try again");
        }finally{
          setLoading(false)
        }
      }}
    >
     { loading ? <Loader2 className='animate-spin h-5 w-5' />  : `${order.status}`}
    </Button>

    </div>
  )
}

export default DetailCard