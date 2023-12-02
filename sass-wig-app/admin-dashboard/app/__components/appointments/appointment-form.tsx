"use client"
import { createAppointment, deleteAppointment, updateAppointment } from '@/actions/appointment-actions'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { appointmentSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'
import FormHeader from '../customs/form-header'
import AlertModal from '../modals/alert-modal'
import AppointmentFormActions from './appointment-actions'
import AppointmentFormFields from './appointment-fields'

interface IAppointmentProps {
  initialData: z.infer<typeof appointmentSchema> & { id: string | null } | null,
  formattedOrderCategory: any[], 
  storeId: string
}

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentForm = ({ initialData, formattedOrderCategory, storeId }: IAppointmentProps ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter()
    const params = useParams()
    
    const title = initialData ? "Edit appointment" : "Create appointment";
    const description = initialData ? "Edit appointment." : "Add a new appointment";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema), // replace with appointment schema
        defaultValues: initialData ? initialData : { 
            name:  '', unit: '', phone: '', date: undefined, time: '', services: undefined, type: "", note: ""
        }
    });

    const onSubmit = async (data: AppointmentFormValues) => {
      try {
        setLoading(true);
        if(initialData){
          const res = await updateAppointment(params.storeId as string, initialData.id as string, data)
          if(res.error){
            toast.error(res.error)
            return
          }else if(res.msg){ 
            toast.success(res.msg)
            router.refresh();
            router.back()
          }
        }else {
          const res = await createAppointment(params.storeId as string, data)
          if(res.error){
            toast.error(res.error)
            return
          }else if(res.msg){ 
            toast.success(res.msg)
            router.refresh();
            router.back()
          }
        }
      } catch (error: any) {
        toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    const onDelete = async () => {
    try {
      setLoading(true);
      const { msg, error } = await deleteAppointment(initialData?.id as string, storeId)
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
    
         <FormHeader title={title} description={description} initialData={initialData} loading={loading} setOpen={setOpen} />

         <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                  <Suspense fallback={<h1> loading  </h1>}>
                     <AppointmentFormFields form={form} loading={loading}  formattedOrderCategory={formattedOrderCategory}/>
                     <AppointmentFormActions action={action} loading={loading} />
                  </Suspense>
                </form>
            </Form>

        </>
    )
}

export default AppointmentForm