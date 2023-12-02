import Heading from '@/components/ui/heading'
import RemoveBg from '@/components/remove-bg'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import History from '@/components/history'

const HomePage = async() => {
  return (
    <div>
       <Heading title="Background Image Remover" description="Remove any image background and download it for free"/>
       <Separator />
       <RemoveBg />
       <History />
    </div>
  )
}

export default HomePage