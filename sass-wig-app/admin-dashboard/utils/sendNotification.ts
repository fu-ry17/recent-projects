import webPush from 'web-push'

webPush.setVapidDetails(
    `mailto:${process.env.NEXT_PUBLIC_WEB_PUSH_EMAIL_TO as string}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY as string, 
    process.env.NEXT_PUBLIC_WEB_PUSH_PRIVATE_KEY as string
)

export const sendNotification = async(subscription: string, data: object) => {
   try {
      await webPush.sendNotification(JSON.parse(subscription), JSON.stringify(data))
   } catch (error: any) {
     console.log('Error', error.message)
   }
}
