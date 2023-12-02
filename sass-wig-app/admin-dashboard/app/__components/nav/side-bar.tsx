"use client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,  SheetTrigger } from "@/components/ui/sheet"
import mainRoutes from "@/hooks/main-routes"
import { cn } from "@/lib/utils"
import { Store } from "@prisma/client"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"

const Sidebar = ({ store }: { store: Store }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const params = useParams()
  
  const routes = mainRoutes({ pathname, params })

  const handleLinkClose = () => {
      if(isOpen){
        setIsOpen(false)
      }
  }

  return (
    <div className="block lg:hidden">
        <Sheet open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
            <SheetTrigger> <Menu aria-label="hambuger-menu" className="w-6 h-6" /> </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                <SheetTitle className="text-start text-xl">
                    {store.name}
                </SheetTitle>
                <SheetDescription className="py-4"> navigate {store.name.toLowerCase()} </SheetDescription>
                    <nav className={cn("flex flex-col flex-start gap-4" )}>
                        {
                            routes.map(r => (
                                <Link href={r.href} key={r.href} onClick={handleLinkClose}
                                className={cn("text-sm font-medium transition-colors hover:text-primary hover:bg-gray-100 dark:hover:text-black hover:rounded-md p-4",
                                r.active ? "text-black dark:text-black bg-gray-100 rounded-md p-4" : "text-muted-foreground")}>
                                    {r.label}
                                </Link>
                            ))
                        }
                    </nav>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default Sidebar