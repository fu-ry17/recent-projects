import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Store } from '@prisma/client'
import AlertInfo from './alert-info'
import PushNotification from './push-notifications'
import SettingsForm from './settings-form'
import SheetForm from './sheet-form'
import SyncClient from './sync-client'

const SettingsClient = ({ store }: { store: Store }) => {
  return (
     <>
      <div className="flex items-center justify-between">
        <Heading title="Store settings" description="Manage store preferences" />
      </div>

      <Separator />
        <PushNotification />
      <Separator />
        <SettingsForm store={store}  />

      <Separator />
      {/* sheet form */}
        <Heading title="Google sheet" description="Configure google sheet automatically sync data" sm />
      <Separator />
        <SheetForm store={store} />
      <Separator />
      {/* sheet form */}

      {/* sync client */}
      <Heading title="Sync Actions" description="Auto sync data to/from google sheet to database" sm />
      <Separator />
      <div>
        <SyncClient store={store} />
      </div>

      <AlertInfo storeId={store.id} />

     </>
  )
}

export default SettingsClient