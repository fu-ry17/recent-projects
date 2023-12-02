import { useRouter, useSearchParams } from 'next/navigation'

const useCustomRouter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query: Record<string, any> = {}
 
  const sort = searchParams.get('sort') as string
  const month = searchParams.get('month') as string
  const status = searchParams.get('status') as string
  const category = searchParams.get('status') as string

  if(sort) { query.sort = sort }
  if(month) { query.month = month }
  if(status) { query.status = status }
  if(category) { query.category = category }

  const pushQuery = ({ sort, month, status, category }: { sort?: string, month?: string, status?: string, category?: string }) => {
   
    if(sort !== undefined){
        sort === 'desc'  ? delete query.sort : query.sort = sort
    }

    if(month !== undefined){
        month === '' ? delete query.month : query.month = month
    }

    if(status !== undefined){
      status === '' ? delete query.status : query.status = status
    }

    if(category !== undefined){
      category === '' ? delete query.category : query.category = category
    }

    const newQuery = new URLSearchParams(query).toString()
    router.push(`?${newQuery}`)
  }
  
  return { query, pushQuery }
}

export default useCustomRouter