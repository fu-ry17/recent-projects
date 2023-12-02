"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { toast } from "react-hot-toast";

import { useParams, useRouter } from "next/navigation"
import { deleteExpense } from '@/actions/expense';
import AlertModal from '@/app/__components/modals/alert-modal';

const ExpenseButtons = ({ id, storeId }: { id: string, storeId: string }) => {
  const router = useRouter()
  const params = useParams()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const onDelete = async () => {
    try {
      setLoading(true);
      const { msg, error } = await deleteExpense(id, storeId)
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
       <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

        <div className="flex justify-between w-full">
            <div></div>
            <div className='flex gap-4'>
                <Button className='px-4' disabled={loading}
                onClick={()=> router.push(`/${params.storeId}/expenses/${id}`)} > 
                    Update 
                </Button>

                <Button variant="destructive" className='px-4' disabled={loading} onClick={()=> setOpen(true)}> Delete </Button>
            </div>
        </div>
    </>
  )
}

export default ExpenseButtons