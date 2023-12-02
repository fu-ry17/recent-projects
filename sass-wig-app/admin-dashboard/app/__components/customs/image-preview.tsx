import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ImagePreview = ({ images, setImages, loading }: { loading: boolean, images: any[], setImages: Dispatch<SetStateAction<any[] | File[]>>}) => {

  const handleDelete = (index: number) => {
      let newImages = images.filter((_, i) => i !== index )
      setImages(newImages)
  }      
  
  return (
    <div className='mb-2 flex items-center flex-wrap gap-4'>
    {images.map((img, i) => (
       <div key={i} className='relative h-[150px] w-[150px] rounded-md overflow-hidden'>
          <div className='z-10 absolute right-2 top-2'>
              <Button type='button' variant="destructive" size="icon" disabled={loading}> 
                 <Trash className='h-4 w-4' onClick={()=> handleDelete(i)} />
              </Button>
          </div>
          <Image className='object-cover' alt='image' priority src={img.url ? img.url : URL.createObjectURL(img)} width={200} height={200}  />
       </div>
    ))}
   </div>
  )
}

export default ImagePreview