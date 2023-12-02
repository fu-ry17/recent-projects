import { ExpenseImage } from '@prisma/client'
import Image from 'next/image'

const ViewImages = ({ images }: { images: ExpenseImage[] }) => {
  return (
    <div className='mb-4 flex items-center flex-wrap gap-4'>
    {images.map((img, i) => (
       <div key={i} className='relative h-[150px] w-[150px] rounded-md overflow-hidden'>
          <Image className='object-cover' alt='image' priority src={img.url} width={200} height={200}  />
       </div>
    ))}
   </div>
  )
}

export default ViewImages