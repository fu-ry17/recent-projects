"use client"

import { createColor, updateColor } from "@/actions/color-actions"
import { deleteExpenseCategory } from "@/actions/expense-category-actions"
import FormHeader from "@/app/__components/customs/form-header"
import InputField from "@/app/__components/customs/input-field"
import AlertModal from "@/app/__components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { colorSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Color } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

type ColorFormValues = z.infer<typeof colorSchema>

export const ColorForm = ({ initialData, storeId }: { initialData: Color | null, storeId: string }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit color' : 'Create color';
  const description = initialData ? 'Edit color.' : 'Add a new color';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: initialData || { name: '', value: '' }
  });

  const onSubmit = async (data: ColorFormValues) => {
    console.log({ data })
    try {
      setLoading(true);
      if(initialData){
        const res = await updateColor(data, initialData.id, storeId)
        if(res.error){
          toast.error(res.error)
          return
        }else if(res.msg){ 
          toast.success(res.msg)
          router.refresh();
          router.back()
        }
      }else {
        const res = await createColor(data, storeId)
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
      const { msg, error } = await deleteExpenseCategory(initialData?.id as string, storeId)
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
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <InputField name="name" placeholder="Color name" disabled={loading} form={form} label="Color name" />
            <div className="flex flex-row gap-x-4 items-center w-full">
              <InputField name="value" placeholder="Color value" disabled={loading} form={form} label="Color value" 
              description="only hex value is accepted: e.g #000" />

              <div className="w-8 h-8 rounded-full border border-gray-300" style={{ backgroundColor: form.getValues("value")}} />

            </div>
          
        </div>

          <Button disabled={loading} className="ml-auto" type="submit"> 
            { loading ? <Loader2 className="w-4 h-4 animate-spin " /> : action }
          </Button>
        </form>
      </Form>
    </>
  );
};

