"use client"

import { deleteExpenseCategory } from "@/actions/expense-category-actions"
import { createProductCategory, updateProductCategory } from "@/actions/product-category-actions"
import { uploadPhoto } from "@/actions/uploadPhoto"
import InputField from "@/app/__components/customs/input-field"
import AlertModal from "@/app/__components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { productCategorySchemaClient } from "@/lib/schema"
import { ImageInput } from "@/types/imageInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductCategory } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import Dropzone from "../customs/dropzone"
import FormHeader from "../customs/form-header"
import ImagePreview from "../customs/image-preview"

type ProductCategoryFormValues = z.infer<typeof productCategorySchemaClient>

export const ProductCategoryForm = ({ initialData, storeId }: { initialData: ProductCategory | null, storeId: string }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[] | File[]>(initialData ? [{ url: initialData.url, referenceId: initialData.referenceId }] : []);

  const title = initialData ? 'Edit product category' : 'Create product category';
  const description = initialData ? 'Edit product category.' : 'Add a new product category';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategorySchemaClient),
    defaultValues: { name: '' }
  })

  const handleUploadImages = async (newImages: File[]) => {
    const formData = new FormData();
    newImages.forEach((file) => formData.append("files", file));
  
    const res = await uploadPhoto(formData, storeId);

    return res.err ? [] : res.uploadImages;
  };
  
  const onSubmit = async (data: ProductCategoryFormValues) => {
    setLoading(true);
    // Initialize imageArr as an empty array
    let imageArr: ImageInput[] = [];
  
    if (images.length > 0) {
      const oldImages = images.filter((img) => img.url);
      const newImages = images.filter((img) => !img.url);

      try {
        if (newImages.length > 0) {
          imageArr = await handleUploadImages(newImages);
        }

        const extractedOldImages = oldImages.map((img) => ({
          url: img.url, referenceId: img.referenceId,
        }))
  
        imageArr = imageArr.length > 0 ? [...imageArr, ...extractedOldImages] : extractedOldImages
  
        console.log({ imageArr })
  
        if (imageArr.length === 0) {
          // Handle the case where imageArr is empty
          toast.error("An error occurred during image upload; try again")
          return;
        }
  
        const postData = { name: data.name, url: imageArr[0]?.url as string, referenceId: imageArr[0]?.referenceId as string }
  
        try {
          setLoading(true);
          if (initialData) {
            const res = await updateProductCategory(postData, storeId, initialData.id)
            if (res.error) {
              toast.error(res.error)
              return;
            } else if (res.msg) {
              toast.success(res.msg)
              router.refresh()
              router.back()
            }
          } else {
            const res = await createProductCategory(postData, storeId)
            if (res.error) {
              toast.error(res.error)
              return;
            } else if (res.msg) {
              toast.success(res.msg)
              router.refresh();
              router.back()
            }
          }
        } catch (error: any) {
          toast.error('Something went wrong.')
        } finally {
          setLoading(false);
        }
      } catch (uploadError) {
        toast.error('An error occurred during image upload; try again')
      }
    }
  }
  
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
        <div className="md:grid md:grid-cols-3 gap-8">
            <InputField name="name" placeholder="Product Category" disabled={loading} form={form} label="Product Category" />  
            <div className="mt-5 md:mt-0">
               <Dropzone title="Upload Image" setImages={setImages} disabled={loading} />
            </div>
        </div>

        <>
          <ImagePreview images={images} setImages={setImages} loading={loading} />
        </>

          <Button disabled={loading} className="ml-auto" type="submit"> 
            { loading ? <Loader2 className="w-4 h-4 animate-spin " /> : action }
          </Button>
        </form>
      </Form>
    </>
  );
};

