"use client"
import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"

interface IModal{
    isOpen: boolean
    title: string
    description: string
    children?: React.ReactNode
    onClose: () => void
}

const Modal = ({ isOpen, title, description, children, onClose }: IModal) => {
  
  const onChange = (open: boolean) => {
    if(open){
        onClose()
    }
  }

  return (
     <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent className="max-w-[350px] sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div>
                {children}
            </div>
        </DialogContent>
     </Dialog>
  )
}

export default Modal