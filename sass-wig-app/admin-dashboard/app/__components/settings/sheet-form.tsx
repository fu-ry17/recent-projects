"use client"

import { configureGoogleSheet } from '@/actions/sheet-actions'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { sheetSchema } from '@/lib/schema'
import { decryptKeys, encryptKeys } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'
import InputField from '../customs/input-field'


type SheetFormValue = z.infer<typeof sheetSchema>

const SheetForm = ({ store }: { store: Store }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [update, setUpdate] = useState<boolean>(false)
  const router = useRouter()

  const form = useForm<SheetFormValue>({
    resolver: zodResolver(sheetSchema),
    defaultValues: store.sheet ? JSON.parse(decryptKeys(store.sheet as string)) : { sheetId: '', sheetClient: '', sheetSecret: '' }
  })

  const onSubmit = async (data: SheetFormValue) => {
    try {
        setLoading(true)
        const jsonData = JSON.stringify(data)
        const encrypted = encryptKeys(jsonData)
     
        const resp = await configureGoogleSheet(encrypted, store.id as string) // server action
        if(resp?.msg){
            toast.success(resp.msg)
            router.refresh()
        }else if(resp?.error){
            toast.error(resp.error)
        }
    } catch (error) {
        toast.error("Something went wrong could not complete process")
    } finally {
       setLoading(false)
    }
  }

  return (
    <>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid md:grid-cols-3 md:gap-8 gap-4">
           <InputField name="sheetId" disabled={update ? false : store.sheet ? true : loading} 
              placeholder="Google Sheet ID" form={form} label="Sheet Id" />
           <InputField type="password" name="sheetClient" disabled={update ? false : store.sheet ? true : loading}
              placeholder="Google Sheet Client Email" form={form} label="Sheet Client Email" />
           <InputField type="password" name="sheetSecret" disabled={update ? false : store.sheet ? true : loading} 
             placeholder="Google Sheet Private Key" form={form} label="Private Key" description='Format: "---BEG.. include both ("") for it to work' />
        </div>
       
       <div className='flex gap-x-4'>
          <Button disabled={loading} type="submit"> 
            { loading ? <Loader2 aria-label='save-changes' className="h-4 w-4 animate-spin" /> : 'Save Changes' } 
          </Button>

          <Button disabled={store?.sheet ? false : true} onClick={()=> setUpdate(!update)}> Configure </Button>
       </div>
     

        </form>
    </Form>
    </>
  )
}

export default SheetForm