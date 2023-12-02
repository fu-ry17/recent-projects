"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Copy, Edit, MoreHorizontal, Trash, View } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import AlertModal from '../modals/alert-modal'

const CellAction = ({ data, url, delFunction, view, copy, update, customId }: { 
  data: any, url: string, delFunction: any, view?: string, copy?: boolean, update?: boolean, customId?: string
}) => {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(customId ? customId : data.id)
    toast.success("Successfully copied billboard")
  }

  return (
    <>
    <AlertModal isOpen={open} onClose={()=> setOpen(false)} loading={loading} onConfirm={async()=> {
        try {
          setLoading(true);
          const res = await delFunction(data?.id, params.storeId as string)
          setOpen(false)
          router.refresh();
          toast.success(res?.msg);
        } catch (error: any) {
          toast.error('Something went wrong, Could not delete');
        } finally {
          setLoading(false);
        }
    }} 
    />
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="ghost" size="icon" className='h-4 w-4 p-0' >
              <span className='sr-only'>open menu</span>
              <MoreHorizontal className='h-4 w-4' />
           </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {
            view ? 
            <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/${view}/${data?.orderId ? data?.orderId as string : data.id}`)} >
               <View className='mr-2 h-4 w-4'/> View
            </DropdownMenuItem> : null
          }
          {
            copy ?
            <DropdownMenuItem onClick={onCopy} >
               <Copy className='mr-2 h-4 w-4'/> Copy
            </DropdownMenuItem> : null
          }

          {
            update ? null :
            <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/${url}/${data.id}`)}>
              <Edit className='mr-2 h-4 w-4' /> Update
            </DropdownMenuItem> 
          }
          <DropdownMenuItem onClick={()=> setOpen(true)}>
             <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default CellAction