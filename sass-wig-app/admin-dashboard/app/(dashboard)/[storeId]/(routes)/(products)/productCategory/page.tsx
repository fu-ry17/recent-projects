import { getColors } from '@/actions/color-actions'
import { getProductCategories } from '@/actions/product-category-actions'
import Wrapper from '@/app/__components/customs/wrapper'
import ProductCategoryClient from '@/app/__components/productCategory/client'

const ProductCategory = async({ params }: { params: { storeId: string }}) => {
  const productCategories = await getProductCategories(params.storeId)
  //colors
  const colors = await getColors(params.storeId)

  return (
    <Wrapper>
        <ProductCategoryClient data={productCategories} storeId={params.storeId} colors={colors} />
    </Wrapper>
  )
}

export default ProductCategory