"use client"

import { ColorColumn, colorColumns } from '@/app/(dashboard)/[storeId]/(routes)/(products)/colors/[colorId]/_component/columns'
import DefaultHeader from '@/components/ui/default-header'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BackComponent from '../customs/back-component'
import { DataTable } from '../datatable/data-table'
import { ProductCategoryColumn, productCategoryColumns } from './columns'
import { useState } from 'react'

const ProductCategoryClient = ({ data, colors, storeId }: { data: ProductCategoryColumn[], storeId: string, colors: ColorColumn[] }) => {
  const [tab, setTab] = useState<string>('categories')

  console.log({ tab })


  return (
    <>
      <BackComponent showText />
      
      <Tabs defaultValue="categories" onChange={(_)=> setTab("colors")}>

        <TabsList className="grid max-w-xs grid-cols-2 mb-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <>
            <DefaultHeader data={data} storeId={storeId as string} title='Product categories' url='productCategory/new' sm />
            <Separator className='mt-3' />
            <DataTable searchKey='name' columns={productCategoryColumns} data={data} />
          </>
        </TabsContent>

        <TabsContent value="colors">
          <>
            <DefaultHeader data={colors} storeId={storeId as string} title='Colors' url='colors/new' sm />
            <Separator className='mt-3' />
            <DataTable searchKey='name' columns={colorColumns} data={colors} />
          </>
        </TabsContent>

      </Tabs>
    </>
  )
}

export default ProductCategoryClient