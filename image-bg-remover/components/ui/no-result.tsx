import React from 'react'

const NoResult = ({ title }: { title: string }) => {
  return (
    <div className='items-center flex justify-center w-full my-6'>
        <p className='text-muted-foreground'>{title}</p>
    </div>
  )
}

export default NoResult