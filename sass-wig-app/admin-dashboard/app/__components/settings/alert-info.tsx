"use client"
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/store/use-origin'

const AlertInfo = ({ storeId }: { storeId: string  }) => {
  const origin = useOrigin()

  return (
    <>
       <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/public/${storeId}`} variant="public" />
    </>
  )
}

export default AlertInfo