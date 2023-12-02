import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Authentication Route',
  description: 'authentication and authorization route',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-center items-center h-full">
       {children}
    </div>
  )
}
