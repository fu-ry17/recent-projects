import prismadb from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import NavActions from './nav-actions'
import MainNav from './main-nav'


const Navbar = async() => {
  const { userId } = auth()
  if(!userId){ redirect('/sign-in') }
  const store = await prismadb.store.findFirst({ where: { userId }})
  if(!store){ redirect('/') }

  return (
    <div className='border-b'>
        <div className='flex h-16 items-center px-4 lg:px-8'>
          <Link href={`/${store.id}`} className='lg:text-xl md:text-2xl text-xl font-bold tracking-tight'>
            {store.name}
          </Link>

          <MainNav className='mx-6' />
    
          <NavActions store={store} />

        </div>
    </div>
  )
}

export default Navbar