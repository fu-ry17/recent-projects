import ToastProvider from '@/components/toast/ToastProvider'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorker from '@/components/serviceWorker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Image Bg Remover',
  description: 'Modern Image Bg Remover',
  manifest: '/manifest.webmanifest',
  themeColor: '#fff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "p-4 lg:max-w-5xl mx-auto")}>
        <ServiceWorker />
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
