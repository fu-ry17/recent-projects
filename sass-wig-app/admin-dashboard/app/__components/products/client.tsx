"use client"

import DefaultHeader from "@/components/ui/default-header"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"

const ProductClient = () => {
  const params = useParams()

  return (
    <>
       <DefaultHeader data={[]} storeId={params.storeId as string} title="Products" url="products/new" settings="productCategory" />
       <Separator />
    </>
  )
}

export default ProductClient