"use client"

import serviceWorkerStore from '@/hooks/service-worker';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { subscribeToPushNotifications } from '@/actions/notification-action';
import { Button } from '@/components/ui/button';
import { base64ToUint8Array } from '@/utils/base64Uint8Array';
import { useParams } from 'next/navigation';

const public_key = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY as string;

const PushNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams()

  const { worker } = serviceWorkerStore()

  useEffect(() => {
     if(worker === null) return 

      worker?.pushManager?.getSubscription().then(sub => {
        if (sub) {
          setLoading(true)
          setSubscription(sub);
          setIsSubscribed(true);
          setLoading(false)
        }
      })

  }, [worker]);

  const subscribeButtonOnClick = async () => {
    if (worker === null) return;

    try {
      setLoading(true)
      const sub = await worker?.pushManager?.subscribe({ userVisibleOnly: true, applicationServerKey: base64ToUint8Array(public_key) });
      setSubscription(sub);
      setIsSubscribed(true);
      const res = await subscribeToPushNotifications(params?.storeId as string, JSON.stringify(sub)) // server action

      res?.error ?  toast.error(res?.error) : toast.success(res?.success as string)

    } catch (error: any) {
      toast.error('Error subscribing:', error?.message);
    }finally{
      setLoading(false)
    }
  }

  const unsubscribeButtonOnClick = async () => {
    try {
      if (subscription) {
        await subscription?.unsubscribe();
        // TODO: You should call your API to delete or invalidate subscription data on the server
        setSubscription(null);
        setIsSubscribed(false);
        toast.success('web push unsubscribed!');
      }
    } catch (error: any) {
      toast.error('Error unsubscribing:', error.message);
    }
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg gap-y-3">
        <div className="space-y-0.5">
          <h1 className='text-lg font-bold tracking-wide'>Push Notifications </h1>
          <h2 className='text-sm text-muted-foreground'> Receive notifications about new products, features, and more.</h2>
        </div>    
        {isSubscribed ? (
        <Button aria-label='unsubscribe' onClick={unsubscribeButtonOnClick}>
           <BellOff aria-label='unsubscribe' className={`mr-0 md:mr-2 h-4 w-4 ${loading ? "hidden" : "block"}`} /> 
           <span className='hidden md:block'> 
              {loading ? <Loader2 className='animate-spin' /> : "unsubscribe"}
           </span> 
        </Button>
        ) : (
          <Button aria-label='subscribe' onClick={subscribeButtonOnClick}>
          <Bell aria-label='subscribe' className={`mr-0 md:mr-2 h-4 w-4 ${loading ? "hidden" : "block"}`} /> 
          <span className='hidden md:block'> 
             {loading ? <Loader2 className='animate-spin' /> : "subscribe"}
          </span> 
         </Button>
        )}
    </div>
  )
}

export default PushNotification;
