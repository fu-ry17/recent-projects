import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import {  Poppins } from 'next/font/google'
import './globals.css'
import ModalProvider from './__components/providers/modal-provider'
import ToastProvider from './__components/providers/toast-provider'
import ServiceWorker from './__components/customs/service-worker'
import { ThemeProvider } from './__components/providers/theme-provider'


const roboto = Poppins({ weight: "500", subsets: ["devanagari"] })

export const metadata: Metadata = {
    title: 'Sass Admin Dashboard',
    description: 'cool admin dashboard',
    manifest: '/manifest.webmanifest',
    // themeColor: '#0A0A0A',
    // colorScheme: 'dark light',
    appleWebApp: true
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={roboto.className}> 
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServiceWorker />     
          <ToastProvider />      
          <ModalProvider />
          {children}
         </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
