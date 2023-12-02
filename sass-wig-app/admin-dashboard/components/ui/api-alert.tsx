import React from "react"
import { Copy, Server } from "lucide-react"
import { toast } from "react-hot-toast"
import { BadgeProps, Badge } from "./badge"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import { Button } from "./button"

interface ApiAlertProps {
    title: string
    description: string
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: 'Public',
    admin: "Admin"
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: 'secondary',
    admin: "destructive"
}

const onCopy = (description: string) => {
   navigator.clipboard.writeText(description)
   toast.success("API route copied to clipboard")
}

export const ApiAlert = ({ title, description, variant }: ApiAlertProps) => {
    return(
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between flex-wrap gap-3 md:gap-0">
               <code className="relative rounded bg-muted font-mono px-[0.3rem] text-sm font-semibold">
                 {description}
               </code>
               <Button variant="outline" size="sm" onClick={()=> onCopy(description)}> <Copy className="w-4 h-4" /> </Button>
            </AlertDescription>
        </Alert>
    )
}