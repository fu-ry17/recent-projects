
import Navbar from "@/app/__components/nav/nav-bar"
import prismadb from "@/lib/prisma"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function DashBoardLayout({ children, params }: {
    children: React.ReactNode
    params: { storeId: string }
})
{
  const { userId } = auth()
  if(!userId){ redirect(`/sign-in`) }

  const store = await prismadb.store.findFirst({ where: { id: params.storeId, userId }})

  if(!store){ redirect("/") }

  return (
    <>
        <Navbar />
        {children}
    </>
  )
  }
  