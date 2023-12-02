import React from 'react'

const Heading = ({ title, description, sm }: { title: string, description: string, sm?: boolean }) => {
  return (
    <div>
       {
         sm ? <h1 className='text-xl font-bold tracking-wider'>{title}</h1> :
         <h1 className='text-2xl font-bold tracking-wide'>{title}</h1>
       }
        <h2 className='text-sm text-muted-foreground'>{description}</h2>
    </div>
  )
}

export default Heading