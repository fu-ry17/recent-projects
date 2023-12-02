import Wrapper from '@/app/__components/customs/wrapper'
import SettingsClient from '@/app/__components/settings/settings-client'
import prismadb from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const SettingPage = async ({ params }: { params: { storeId: string }}) => {
  const { userId } = auth()
  if(!userId) { redirect('/sign-in') }

  const store = await prismadb.store.findFirst({ where: { id: params.storeId, userId }})
  if(!store){ redirect("/") }

  return (
      <Wrapper>
         <SettingsClient store={store} />
      </Wrapper>
  )
}

export default SettingPage