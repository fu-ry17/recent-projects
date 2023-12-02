"use client"
import { uploadPhoto } from "@/actions/uploadPhoto";
import { Separator } from "@/components/ui/separator";
import { expenseSchema } from "@/lib/schema";
import { IExpense } from "@/types/expenseTypes";
import { ImageInput } from "@/types/imageInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseCategory, ExpenseImage } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import FormHeader from "../customs/form-header";
import AlertModal from "../modals/alert-modal";

import { createExpense, deleteExpense, updateExpense } from "@/actions/expense";
import { Form } from "@/components/ui/form";
import ExpenseFormActions from "./expense-actions";
import ExpenseFormFields from "./expense-fields";

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const ExpenseForm = ({
  initialData, expenseCategories, storeId
}: {
  initialData: IExpense & { expenseImages: ExpenseImage[] } | null;
  expenseCategories: ExpenseCategory[], storeId: string
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[] | File[]>(initialData ? initialData.expenseImages : []);
  
  const title = initialData ? "Edit expense" : "Create expense";
  const description = initialData ? "Edit expense category." : "Add a new expense";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: initialData?.title || "",
      amount: initialData?.amount || 0,
      category: { value: initialData?.expenseCategoryId, label: initialData?.expenseCategory.name} || { value: '', label: ''},
      reference: initialData?.reference || "",
    },
  });

  const handleUploadImages = async (newImages: File[]) => {
    const formData = new FormData();
    newImages.forEach((file) => formData.append("files", file));

    const res = await uploadPhoto(formData, params.storeId as string);
    if (res.err) { toast.error(res.err) }

    return res.uploadImages
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      setLoading(true);
      let imageArr: ImageInput[] | undefined;
      
      if (images.length > 0) {
        const oldImages = images.filter(img => img.url);
        const newImages = images.filter(img => !img.url);
  
        let resp: ImageInput[] = []
        if (newImages.length > 0) {
           resp = await handleUploadImages(newImages)
        } 

        const extractedOldImages = oldImages.map(img => ({ url: img.url, referenceId: img.referenceId }))
        imageArr = resp.length > 0 && extractedOldImages.length > 0 ? [...resp, ...extractedOldImages] : extractedOldImages.length > 0 ? extractedOldImages : resp
      }

      const postData = { ...data, images: imageArr?.length ? imageArr : [] };

      if(initialData){
        const res = await updateExpense(postData, initialData.id, storeId)
        if(res.error){
          toast.error(res.error)
          return
        }else if(res.msg){ 
          toast.success(res.msg)
          router.refresh();
          router.back()
        }
      }else {
        const res = await createExpense(postData, storeId)
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
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const { msg, error } = await deleteExpense(initialData?.id as string, storeId)
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
    <Suspense fallback={<h1> Loading... </h1> }>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <FormHeader title={title} description={description} initialData={initialData} loading={loading} setOpen={setOpen} />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <ExpenseFormFields expenseCategories={expenseCategories} form={form} loading={loading} />
          <ExpenseFormActions action={action} images={images} loading={loading} setImages={setImages} />
        </form>
      </Form>
    </Suspense>
  );
};
