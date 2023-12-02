import { Loader2 } from "lucide-react"

const Loader = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
        <div className='animate-pulse'>
          <Loader2 className='animate-spin h-6 w-6' />
        </div>
    </div>
  )
}

export default Loader