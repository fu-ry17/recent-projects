import Wrapper from '@/app/__components/customs/wrapper'
import { ProductCategoryForm } from '@/app/__components/productCategory/pc-form'
import prismadb from '@/lib/prisma'

const ProductCategoryCreateUpdate = async ({ params} : { params: { pcparams: string, storeId: string  }}) => {
  const productCategory = await prismadb.productCategory.findUnique({ where: { id: params.pcparams, storeId: params.storeId }})

  return (
     <Wrapper>
        <ProductCategoryForm initialData={productCategory} storeId={params.storeId} />
     </Wrapper>
  )
}

export default ProductCategoryCreateUpdate