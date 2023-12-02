"use client"

import { generateApiKey } from '@/actions/api-key-actions'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useOrigin } from '@/store/use-origin'
import { KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { ApiKeysColumn, apiKeyColumns } from './columns'
import { DataTable } from '../datatable/data-table'
import { useRouter } from 'next/navigation'


const ApiDocsClient = ({ storeId, apiKeys }: { storeId: string, apiKeys: ApiKeysColumn[] }) => {
  const origin = useOrigin()
  const router = useRouter()

  return (
    <>
    <Heading title='Api Docs' 
      description='Explore our documentation for seamless integration and unleash endless possibilities'
     />
    <Separator />

  
    <div className='flex gap-4 flex-wrap items-center'>
       <h1> Base Url :  </h1>
       <code className="bg-muted text-sm cursor-pointer font-mono px-[0.3rem] font-semibold p-2 rounded-md" onClick={()=> {
          navigator.clipboard.writeText(`${origin}/api/public/${storeId}`)
          toast.success("API route copied to clipboard")
       }}>
          {`${origin}/api/public/${storeId}`}
       </code>
    </div>

    <div>
      <h1 className='mb-3'> Response Format : JSON {`{}`}</h1>
      <h1> Methods : GET , POST, PATCH, PUT, DELETE </h1>
    </div>

    <Separator />
    
    <div className='flex items-center justify-between'>
      <Heading title='Api Keys' description='Generate secure API keys with ease for streamlined access control.' sm />
      <Button aria-label='generate-new' onClick={async()=> {
          const res = await generateApiKey(storeId)
          if(res.error){
            toast.error(res.error)
          }else if(res.msg){
            toast.success(res.msg)
            router.refresh()
          }
      
      }}>
          <KeyRound aria-label='add-new' className='mr-0 md:mr-2 h-4 w-4' /> <span className='hidden md:block'> Generate Key  </span>
      </Button>
    </div>
    <Separator />

     <DataTable columns={apiKeyColumns} data={apiKeys} searchKey='' noDisplay />

    <Separator />
   
    <Heading title='Api Endpoints' description='API endpoints for enhanced connectivity and control in your system.' sm />
    <Separator />

    <h1> Api Endpoints Here </h1>

  </>
  )
}

export default ApiDocsClient