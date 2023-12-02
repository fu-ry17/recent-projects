"use client"
import { useStoreModal } from "@/store/useStoreModal"
import { useEffect } from "react"

const RootPage = () => {
  const { isOpen, onOpen }= useStoreModal()

  useEffect(()=> {
     if(!isOpen){
       onOpen()
     }
  },[isOpen, onOpen ])

  return null
}

export default RootPage