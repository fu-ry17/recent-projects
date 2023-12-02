"use client"
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import Modal from '@/components/ui/modal'
import { storeSchema } from '@/lib/schema'
import { useStoreModal } from '@/store/useStoreModal'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'
import InputField from '../customs/input-field'
import { createStore } from '@/actions/store-actions'

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal()
  const [isLoading, setIsLoading ] = useState<boolean>(false)
  
  const form = useForm<z.infer<typeof storeSchema>>({
    // @ts-ignore
    resolver: zodResolver(storeSchema),
    defaultValues: { name: '' },    
  })

  const onSubmit = async(values: z.infer<typeof storeSchema>) => {
   try {
       setIsLoading(true)
       const res = await createStore(values.name)
       console.log({ res })
       if(res?.error){
          toast.error(res.error)
       }else if(res?.msg){
          toast.success(`${values.name} has been created`)
          window.location.assign(`/${res.msg as string}`)
       }
  
   } catch (error: any) {
      toast.error(error.message)  
   } finally {
       setIsLoading(false)
   }
 }

  return (
     <Modal title='Create Store' description='create your store to get started'
        isOpen={isOpen} onClose={onClose}>
        <div className='space-y-4 py-2 pb-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <InputField name='name' placeholder='Store name' form={form} disabled={false} 
                    description='This will be the display store name' />

                    <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                    <Button onClick={onClose} variant="outline" disabled={isLoading} > Cancel </Button>
                    <Button type='submit' disabled={isLoading} > { isLoading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Continue'}</Button>
                    </div>
                    
                </form>
            </Form>
        </div>
     </Modal>
  )
}

export default StoreModal