import DefaultHeader from '@/components/ui/default-header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import CommissionList from './c-list'
import { CommissionColumn } from './column'

const CommissionClient = ({ storeId, data, count, month }: {
   storeId: string, data:  Record<string, any[] | CommissionColumn[]>, count: number, month: string
}) => {
  return (
    <>
      <DefaultHeader data={[]} count={count} storeId={storeId as string} title='Commissions' url='commissions/new' settings='orderCategory' />
      <Separator />
      <CommissionList data={data} month={month} />
    </>
  )
}

export default CommissionClient