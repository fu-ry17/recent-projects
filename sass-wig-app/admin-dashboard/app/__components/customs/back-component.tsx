"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BackComponent = ({ showText, loading}: { showText?: boolean, loading?: boolean }) => {
  const router = useRouter()

  return (
    <>
      <Button size="sm" variant="outline" onClick={()=> router.back()} disabled={loading}>
         <ArrowLeft className='h-4 w-4' />
        <span className={cn(showText ? "md:block pl-2" : "hidden")} > Back </span>
      </Button> 
    </>
  )
}

export default BackComponent