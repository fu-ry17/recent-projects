"use server"
import cloudinary from "@/lib/cloudinary"
import prismadb from "@/lib/prisma"
import { productCategorySchema } from "@/lib/schema"
import { ResponseObject } from "@/types/types"
import { auth } from "@clerk/nextjs"
import { format } from "date-fns"
import { ZodError } from "zod"


type createData = {
  name: string, url: string, referenceId: string
}

export const getProductCategories = async(storeId: string) => {
    try {
        const { userId } = auth()
        if(!userId) return []

        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
        if(!store)return []
        
        const data = await prismadb.productCategory.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' }})
        
        const formattedExpenseCategories = data.map(item => ({ 
            id: item.id,
            name: item.name,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }))

        return formattedExpenseCategories

    } catch (error) {
        return []
    }
}

export const createProductCategory = async (data: createData, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth()
        if (!userId) { return { error: "Unauthorized access" } }
      
       if(!data.name) return { error: "Product category title is required"}
       await productCategorySchema.parseAsync(data)

       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }

       const categ = await prismadb.productCategory.findFirst({ 
          where: { name: data.name.toLowerCase().replace(/ /g, '-') }
       })

       if(categ) { return { error: "Category already exists"} }
    
       await prismadb.productCategory.create({
            data: { ...data, name: data.name.toLowerCase().replace(/ /g, '-') , storeId }
       })
    
       return { msg: "Product category created" };

    } catch (error) {
        if(error instanceof ZodError){
            return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`PRODUCT_CATEGORY_CREATE_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const updateProductCategory = async (data: createData, storeId: string, id: string): Promise<ResponseObject> => {
    try {
       const { userId } = auth()
       if (!userId) { return { error: "Unauthorized access" } }

       if(!data.name) return { error: "Product category title is required"}
       // zod validate
       await productCategorySchema.parseAsync(data)

       //find store
       const store = await prismadb.store.findFirst({ where: { id: storeId, userId } })
       if(!store)return { error: "Unauthorized Access" }

       const categ = await prismadb.productCategory.findFirst({ where: { id, storeId }})

       if(!categ){ return { error: "No category was found!"}}
    
        await prismadb.productCategory.update({
            data: { ...data, name: data.name.toLowerCase().replace(/ /g, '-') },  where: { id, storeId }
        })
    
        return { msg: "Product Category updated" };

    } catch (error) {
        if(error instanceof ZodError){
           return { error: error.errors[0].message }
        }else if (error instanceof Error) {
            console.error(`PRODUCT_CATEGORY_PATCH_ERROR: ${error.message}`);
            return { error: "Something went wrong, try again" };
        }
        return { error: "An unexpected error occurred" };
    }
}

export const deleteProductCategory = async (id: string, storeId: string): Promise<ResponseObject> => {
    try {
        const { userId } = auth();
        if (!userId) return { error: "Unauthorized access" };

        // Find store
        const store = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!store) return { error: "Unauthorized Access" };

        const productCategory = await prismadb.productCategory.findFirst({ where: { id }, include: { products: true } });

        if (productCategory) {
            if (productCategory.products.length > 0) {
                return { error: "Delete all products related to the order category" };
            }
        }

        // Delete image from cloudinary
        await cloudinary.uploader.destroy(productCategory?.referenceId as string);

        await prismadb.productCategory.delete({ where: { id, storeId } });

        return { msg: "Product category deleted" };
    } catch (error) {
        const errorMessage = "Something went wrong, try again";
        console.error(`EXPENSE_CATEGORY_DELETE_ERROR: ${errorMessage}`);
        return { error: errorMessage };
    }
}