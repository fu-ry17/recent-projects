"use client"

import React from 'react'
import Heading from './heading'
import { Plus, Settings2 } from 'lucide-react'
import { Button } from './button'
import { useRouter } from 'next/navigation'

const DefaultHeader = ({ title, data, storeId, url, settings, sm, count }:
   { title: string, data: any[], storeId: string, url: string, settings?: string, sm?: boolean, count?: number }
) => {
  const router = useRouter()

  return (
    <div className='flex items-center justify-between gap-4'>
        <Heading title={`${title} (${count ? count : data.length})`} description={`Manage ${title.toLocaleLowerCase()} for your store`} sm={sm}/>
        <div className='flex gap-2'>
          <Button aria-label='add-new' onClick={()=> router.push(`/${storeId}/${url}`)}>
              <Plus aria-label='add-new' className='mr-0 md:mr-2 h-4 w-4' /> <span className='hidden md:block'> Add new  </span>
          </Button>
          {
            settings ? 
            <Button onClick={()=> router.push(`/${storeId}/${settings}`)}>
              <Settings2 aria-label='settings' className='mr-0 md:mr-2 h-4 w-4' />
            </Button> : null
          }
        </div>
    </div>
  )
}

export default DefaultHeader