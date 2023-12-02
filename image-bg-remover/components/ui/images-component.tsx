import Image from 'next/image'
import Download from './download'
import Heading from './heading'
import { Separator } from './separator'
import NoResult from './no-result'

const ImagesComponent = ({ imageUrl, removedBg }: { imageUrl: File | null, removedBg: string | null }) => {
  return (
    <div className='my-6'>
        <Heading title="Uploaded Images" description="uploaded images" />
        <Separator />

        {
            imageUrl === null && <NoResult title='No Image has been uploaded' /> 
        }
        
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 my-4'>
            {
                imageUrl !== null && <>
                  <Image src={URL.createObjectURL(imageUrl)} alt='uploaded image' height={200} width={200} />
                </>
            }
            {
                removedBg && <div className='flex flex-col items-center gap-4'>
                  <Image src={removedBg} height={200} width={200} alt='removed-bg'  />
                  <Download image={removedBg as string} />
                </div>
            }
        </div>
    </div>
  )
}

export default ImagesComponent