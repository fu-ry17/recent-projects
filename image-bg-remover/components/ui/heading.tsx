import React from 'react'

const Heading = ({ title, description}: { title: string, description: string }) => {
  return (
    <div className='mb-4'>
      <h1 className='text-3xl font-bold'>{title} </h1>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}

export default Heading