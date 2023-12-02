"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/modal"

interface AlertModalProps {
    isOpen: boolean
    onClose: ()=> void
    onConfirm: ()=> void
    loading: boolean
    title?: string
}

export const AlertModal = ({ isOpen, onClose, onConfirm, loading, title }: AlertModalProps) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=> {
      setIsMounted(true)
    },[])

    if(!isMounted) return null

   return(
     <Modal isOpen={isOpen} title={title ? title : "Are you sure want to continue?"} description="This action cannot be undone once the process is completed" onClose={onClose}>
       <div className="pt-6 space-x-2 flex items-center justify-end w-full">
         <Button disabled={loading} variant="outline" onClick={onClose}> Cancel</Button>
         <Button variant="destructive" disabled={loading} onClick={onConfirm}> { loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}  </Button>
       </div>
     </Modal>
   )
}

export default AlertModal