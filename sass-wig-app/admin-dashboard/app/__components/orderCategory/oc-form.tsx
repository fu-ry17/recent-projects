"use client"
import { createOrderCategory, deleteOrderCategory, updateOrderCategory } from "@/actions/order-category-actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { orderCategorySchema } from "@/lib/schema"
import { IOrderCategory } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import FormHeader from "../customs/form-header"
import InputField from "../customs/input-field"
import AlertModal from "../modals/alert-modal"

type OrderCategoryFormValues = z.infer<typeof orderCategorySchema>

export const OrderCategoryForm = ({ initialData, storeId }: { initialData: IOrderCategory | null, storeId: string }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit order category' : 'Create order category';
  const description = initialData ? 'Edit order category.' : 'Add a new order category';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<OrderCategoryFormValues>({
    resolver: zodResolver(orderCategorySchema),
    defaultValues: initialData || { name: '', appointmentUse: false, comissionAmount: 0, storeAmount: 0, nonStoreAmount: 0 }
  });

  const onSubmit = async (data: OrderCategoryFormValues) => {
    try {
      setLoading(true);
      if(initialData){
        const res = await updateOrderCategory(data, storeId, initialData.id)
        if(res.error){
          toast.error(res.error)
          return
        }else if(res.msg){ 
          toast.success(res.msg)
          router.refresh();
          router.back()
        }
      }else {
        const res = await createOrderCategory(data, storeId)
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
      const { msg, error } = await deleteOrderCategory(initialData?.id as string, storeId)
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
        <div className="md:grid md:grid-cols-3 gap-8">
            <InputField name="name" placeholder="Order Category" disabled={loading} form={form} label="Order Category" />
            <InputField type="number" name="comissionAmount" placeholder="Comission" disabled={loading} form={form} label="Comission Amount"
            description="default value used when category is used for comission" />

            <FormField
              control={form.control}
              name="appointmentUse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border py-3 px-2 mt-4">
                  <div className="">
                    <FormLabel>Appointment Service</FormLabel>
                    <FormDescription>
                      Enable to use in appointments
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value}  
                    onCheckedChange={field.onChange} 
                   />
                  </FormControl>
                </FormItem>
              )}
            />

          { form.getValues("appointmentUse") === true ? 
           <>
            <InputField type="number" name="storeAmount" placeholder="Store Amount" disabled={loading} form={form} label="Store Amount"
              description="default amount if item belongs to the store" />
   
             <InputField type="number" name="nonStoreAmount" placeholder="Non-Store Amount" disabled={loading} form={form} label="Non Store Amount"
              description="default amount if item does not belong your store"   />
            </>
             : null
           }
  

          </div>

          <Button disabled={loading} className="ml-auto" type="submit"> 
            { loading ? <Loader2 className="w-4 h-4 animate-spin " /> : action }
          </Button>
        </form>
      </Form>
    </>
  );
};