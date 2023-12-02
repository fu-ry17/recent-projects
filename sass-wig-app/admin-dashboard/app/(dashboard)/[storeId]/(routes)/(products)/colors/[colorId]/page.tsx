import React from 'react'
import { ColorForm } from './_component/color-form'
import Wrapper from '@/app/__components/customs/wrapper'
import prismadb from '@/lib/prisma'

const ColorsCreateUpdate  = async({ params }: { params: { storeId: string, colorId: string }}) => {
  const color = await prismadb.color.findFirst({ where: { id: params.colorId }})

  return (
    <Wrapper>
       <ColorForm initialData={color} storeId={params.storeId} />
    </Wrapper>
  )
}

export default ColorsCreateUpdate 