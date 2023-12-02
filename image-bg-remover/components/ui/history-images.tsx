"use client"
import imageStore from '@/store/imageStore'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Download from './download'
import {Loader2} from 'lucide-react'
import { Button } from './button'

const HistoryImages = () => {
  const [mounted, setMounted] = useState(false)
  const { images, deleteImage } = imageStore()
  
  useEffect(()=> {
    setMounted(true)
  },[])

  if(!mounted) return <div className='flex items-center'> <Loader2 className='w-6 h-6 animate-spin' />  </div>
   
  return (
    <div>
        <h2 className='font-semibold tracking-wide mt-2'>You have {images.length} images</h2> 

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 items-stretch'>
            {
                images.map(img => (
                  <div key={img.url}>
                    <Image src={img.url} height={200} width={200} alt='removed-bg'  />
                    <div className='flex gap-2'>
                      <Download image={img.url as string} />
                      <Button variant="destructive" onClick={()=> deleteImage({ url: img.url })}> delete </Button>
                    </div>
                  </div>
                ))
            }
          
        </div>
    </div>
  )
}

export default HistoryImages