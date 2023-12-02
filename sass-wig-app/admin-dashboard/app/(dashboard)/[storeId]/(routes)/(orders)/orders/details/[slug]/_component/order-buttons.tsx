"use client"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from "react-hot-toast";

import { deleteOrder } from '@/actions/order-ations';
import { IFormattedOrder } from '@/types/types';
import { useParams, useRouter } from "next/navigation";
import AlertModal from '@/app/__components/modals/alert-modal';

const OrderButtons = ({ order, storeId, loading: coLoading }: { order: IFormattedOrder, storeId: string, loading: boolean }) => {
  const router = useRouter()
  const params = useParams()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const onDelete = async () => {
    try {
      setLoading(true);
      const { msg, error } = await deleteOrder(order.id, storeId)
      if(error){ 
        toast.error(error)
        return
      }else if(msg){
        router.refresh();
        router.back()
        toast.success(msg);
      }
    } catch (error: any) {
      toast.error('Something went wrong, try again');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
       <AlertModal 
       title={order.appointmentId ?
        `Are you sure you want to delete this order and the realted appointment?` :
        `Are you sure you want to delete this order by ${order.name}?`}
       isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

        <div className="flex justify-between w-full flex-wrap">
            <div></div>
            <div className='flex gap-4'>
                {
                    order.appointmentId ?
                    <Button className='px-4' disabled={loading || coLoading}
                    onClick={()=> router.push(`/${params.storeId}/appointments/${order.appointmentId}`)} > 
                        Update Appointment
                    </Button> : null
                }
                <Button className='px-4' disabled={loading || coLoading}
                onClick={()=> router.push(`/${params.storeId}/orders/${order.id}`)} > 
                    Update 
                </Button>

                <Button variant="destructive" className='px-4' disabled={loading} onClick={()=> setOpen(true)}> Delete </Button>
            </div>
        </div>
    </>
  )
}

export default OrderButtons