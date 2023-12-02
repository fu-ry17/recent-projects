"use client"
import { cn, validImage } from '@/lib/utils';
import ReactDropzone from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';

interface ImagesProps{
    title: string, setImages: Dispatch<SetStateAction<any[] | File[]>>, disabled: boolean 
}

const Dropzone = ({ title, setImages, disabled }: ImagesProps ) => {

  const handleDrop = async (file: File[]) => {
    const files = [...file]
    const imageArr: File[] = []

    files.forEach(item => {
         const check = validImage(item)
         if(check) return toast.error(check.msg) //check if file format is valid
         imageArr.push(item)
    })
     
    setImages(prev =>  [ ...prev, ...imageArr])
  }

  return (
    <div>
      <ReactDropzone onDrop={handleDrop} disabled={disabled}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}
          className='text-center p-6 rounded-xl border border-dotted border-black dark:border-white dark:border'>
            <input type='file' {...getInputProps()} accept='image/*' disabled={disabled}  />
            <p className={cn('cursor-pointer text-sm tracking-wide font-semibold', disabled ? 'text-muted-foreground' : '')}>Drag & Drop image format (png, jpeg, jpg)</p>
            <Button type='button' className='mt-4' variant="secondary" disabled={disabled}> { title } </Button>
          </div>
        )}
      </ReactDropzone>
    </div>
  )
}

export default Dropzone