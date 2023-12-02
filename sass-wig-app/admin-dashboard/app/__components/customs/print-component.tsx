"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

const PrintComponent: React.FC<{
   componentRef: React.MutableRefObject<null>, id: string,loading: boolean, 
   showText?: boolean
 }> = ({ id, componentRef, showText, loading }) => {

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${id}`
  })

  return ( 
    <>
       <Button size="sm" onClick={handlePrint} disabled={loading}>
         <Printer className='h-4 w-4' />
        <span className={cn(showText ? "md:block pl-2" : "hidden")} > Print </span>
      </Button> 
    </>
  )
}

export default PrintComponent