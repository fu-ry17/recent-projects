"use client"
import mainRoutes from '@/hooks/main-routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

const MainNav = ({ className }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()
  const params = useParams()
  const routes = mainRoutes({ params, pathname })

  return (
    <nav className={cn("lg:flex hidden items-center space-x-4 lg:space-x-6", className )}>
      {
        routes.map(r => (
            <Link href={r.href} key={r.href}
            className={cn("text-sm font-medium transition-colors hover:text-primary",
            r.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                {r.label}
            </Link>
        ))
      }
    </nav>
  )
}

export default MainNav