import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex w-full items-center justify-center h-screen'>
        <Loader2 className='w-6 h-6 animate-spin' />
    </div>
  )
}

export default Loading