import Wrapper from '@/app/__components/customs/wrapper'
import { ProductForm } from '@/app/__components/products/p-form'
import React from 'react'

const ProductCreateUpdate = ({ params }: { params: { storeId: string }}) => {
  return (
    <Wrapper>
       <ProductForm initialData={null} storeId={params.storeId}  />
    </Wrapper>
  )
}

export default ProductCreateUpdate