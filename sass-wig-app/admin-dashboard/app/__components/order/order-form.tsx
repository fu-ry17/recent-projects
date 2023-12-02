"use client"
import { createOrder, deleteOrder, updateOrder } from "@/actions/order-ations"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { headSizeArr, paymentMethodArr } from "@/lib/dataArr"
import { orderSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Order, OrderCategory } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import FormHeader from "../customs/form-header"
import InputField from "../customs/input-field"
import MultiSelectField from "../customs/multi-select-field"
import SelectField from "../customs/select-field"
import AlertModal from "../modals/alert-modal"
import { formatCategory } from "@/lib/utils"

type OrderFormValues = z.infer<typeof orderSchema>

export const OrderForm = ({ initialData, formattedOrderCategory, storeId  }:
    { initialData: Order & { orderCategories: OrderCategory[] } | null, formattedOrderCategory: any[], storeId: string }
) => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit order' : 'Create order';
  const description = initialData ? 'Edit order' : 'Add a new order';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: initialData ? {
        ...initialData, categories: formatCategory(initialData.orderCategories),
        unit: initialData.unit as string, headSize: initialData.headSize as string,
        amountPaid: parseFloat(String(initialData.amountPaid)), balance: parseFloat(String(initialData.balance))

    } : { 
       name: "", phone: "", headSize: "" , amountPaid: 0, balance: 0, unit: "", quantity: 1, paymentMethod: "", 
       note: "", categories: undefined
    }
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      if(initialData){
        const res = await updateOrder(data, initialData.id, storeId)
        if(res.error){
          toast.error(res.error)
          return
        }else if(res.msg){ 
          toast.success(res.msg)
          router.refresh();
          router.back()
        }
      }else {
        const res = await createOrder(data, storeId)
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
      const { msg, error } = await deleteOrder(initialData?.id as string, storeId)
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

      <FormHeader title={title} description={description} initialData={initialData} loading={loading} setOpen={setOpen}  />

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="md:grid md:grid-cols-3 gap-8">
            <InputField name="name" placeholder="Client name" disabled={loading} form={form} label="Client name" />
            <InputField name="unit" placeholder="Unit" disabled={loading} form={form} label="Unit" />
            <InputField name="phone" placeholder="+254" disabled={loading} form={form} label="Phone number"
            description="use the +254 phone number format" />

            <InputField type="number" name="quantity" placeholder="Quantity" disabled={loading} form={form} label="Quantity" />
            <InputField type="number" name="amountPaid" placeholder="Amount Paid" disabled={loading} form={form} label="Amount Paid" />
            <InputField type="number" name="balance" placeholder="Balance" disabled={loading} form={form} label="Balance" />

            <MultiSelectField name="categories" data={formattedOrderCategory} 
            disabled={loading} form={form} label="Category" placeholder="Choose category" />
            
            <SelectField data={paymentMethodArr} disabled={loading} form={form} label="Payment Method" name="paymentMethod" placeholder="Payment Method"/>

            <SelectField data={headSizeArr} disabled={loading} form={form} label="Head Size" name="headSize" placeholder="Head Size"/>

            <InputField name="note" placeholder="More info...." disabled={loading} form={form} label="Note" textarea
            description="Any addittional information goes here" />
    
          </div>

          <Button disabled={loading} className="ml-auto" type="submit"> 
            { loading ? <Loader2 className="w-4 h-4 animate-spin " /> : action }
          </Button>
        </form>
      </Form>
    </>
  );
};