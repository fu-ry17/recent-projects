"use client"

import { createCommission, deleteCommission, updateCommission } from "@/actions/commission-actions"
import InputField from "@/app/__components/customs/input-field"
import AlertModal from "@/app/__components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { commissionSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseCategory } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import FormHeader from "../customs/form-header"
import MultiSelectField from "../customs/multi-select-field"

type CommissionFormValues = z.infer<typeof commissionSchema>

export const CommissionForm = ({ initialData, formattedOrderCategory, storeId }: { 
   initialData: ExpenseCategory | null, storeId: string, formattedOrderCategory: any[] | [] }
) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit commission' : 'Create commission';
  const description = initialData ? 'Edit commission' : 'Add a new commission';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: initialData || { name: '', unit: '', services: undefined}
  });

  const onSubmit = async (data: CommissionFormValues) => {
    console.log({ data })
    try {
      setLoading(true);
      if(initialData){
        const res = await updateCommission(data, storeId, initialData.id)
        if(res.error){
          toast.error(res.error)
          return
        }else if(res.msg){ 
          toast.success(res.msg)
          router.refresh();
          router.back()
        }
      }else {
        const res = await createCommission(data, storeId)
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
      const { msg, error } = await deleteCommission(initialData?.id as string, storeId)
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

     <FormHeader title={title} description={description} loading={loading} initialData={initialData} setOpen={setOpen} />

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
         <div className="md:grid md:grid-cols-3 gap-8">
            <InputField name="name" placeholder="Employee Name" disabled={loading} form={form} label="Employee Name" />
            <InputField name="unit" placeholder="Unit" disabled={loading} form={form} label="Unit" description="the unit worked on" />
            <MultiSelectField name="services" data={formattedOrderCategory} 
            disabled={loading} form={form} label="Service" placeholder="Choose service(s)" />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit"> 
            { loading ? <Loader2 className="w-4 h-4 animate-spin " /> : action }
          </Button>
        </form>
      </Form>
    </>
  );
};

