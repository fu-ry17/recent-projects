"use client"
import React, { useState } from 'react'
import ReactDropzone from 'react-dropzone';
import { Button } from './button';
import { Separator } from './separator';
import ImagesComponent from './images-component';
import { removeBackground } from '@/actions/removeBg';
import imageStore from '@/store/imageStore';
import { toast } from 'react-hot-toast';

const Dropzone = () => {
  const [imageUrl, setImageUrl] = useState<File | null>(null)
  const [removedBg, setRemovedBg] = useState<string | null>(null)
  const { addImage } = imageStore()

  const handleDrop = async (files: File[]) => {
     const file = files[0]
     if(!file) return 

     setImageUrl(file)
     try {
        const resultUrl = await removeBackground(file);
        setRemovedBg(resultUrl);
        addImage({ url: resultUrl })
        toast.success("image background removed")
      } catch (error) {
        if(error instanceof Error){
          toast.error(error.message)
          setRemovedBg(null);
        }
      }
  }

  return (
    <div>
      <ReactDropzone onDrop={handleDrop} >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}
          className='text-center p-10 rounded-xl border border-dotted border-black my-6'>
            <input {...getInputProps()} accept='image/*' />
            <p className='cursor-pointer text-sm'>Drag & drop an image here or click to select an image.</p>
            <Button className='mt-4' variant="secondary"> Upload Image </Button>
          </div>
        )}
      </ReactDropzone>

      <Separator />

      <ImagesComponent imageUrl={imageUrl} removedBg={removedBg} />
    </div>
  )
}

export default Dropzone