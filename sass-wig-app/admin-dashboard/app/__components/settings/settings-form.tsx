"use client"
import { Form } from '@/components/ui/form'
import { storeSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import InputField from '../customs/input-field'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { updateStore } from '@/actions/store-actions'

type SettingsFormValues = z.infer<typeof storeSchema>

const SettingsForm = ({ store }: { store: Store }) => {
   const [loading, setLoading] = useState(false);
   const router = useRouter()

   const form = useForm<SettingsFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: store
   })

   const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            const res = await updateStore(data.name, store.id)
            if(res?.error){
               toast.error(res?.error)
            }else if(res?.msg){
                toast.success(res.msg)
                router.refresh();
            }
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }
    
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="md:grid grid-cols-3 gap-8">
        <InputField name="name" disabled={loading} placeholder="Store Name" form={form} label="Store Name" />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit"> { loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes' } </Button>
        </form>
   </Form>
  )
}

export default SettingsForm