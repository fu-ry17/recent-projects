"use client"
import { completeCommission } from '@/actions/commission-actions'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

const TitleLink = ({ name, id, url, status, paid }: { name: string, id: string, url?: string, status?: string, paid?: boolean }) => {
  const params = useParams()
  const router = useRouter()

  const [ loading, setLoading ] = useState(false)

  return (
    <div onClick={async() =>{
       if(url !== undefined){ 
        router.push(`/${params.storeId}/${url}/${id}`)
       }else{
          // fixed for commission temporary
          if(paid !== undefined){
            try {
              setLoading(true)
              const res = await completeCommission(id, params.storeId as string, paid)
              if(res.error){
                toast.error(res.error)
              }else if(res.msg){
                toast.success(res.msg)
                router.refresh()
              }
            } catch (error: any) {
              toast.error("Something went wrong during update")
            }finally{
              setLoading(false)
            }
          }
       }
    }} className='cursor-pointer relative'>
      {status && (
        <div className={`absolute -top-3 left-0 px-3 py-1 rounded-lg ${loading ? 'animate-pulse' : 'animate-none'} ${
          status === 'pending' ? 'bg-yellow-500' :
          status === 'refund' ? 'bg-gray-500' :
          status === 'cpending' ? 'bg-gray-400' :
          status === 'delivered' ? 'bg-green-500' :
          status === 'cancelled' ? 'bg-red-500' :
          'bg-gray-400'
        }`}>
        </div>
      )}

      <h1>{name}</h1>
    </div>
  )
}

export default TitleLink