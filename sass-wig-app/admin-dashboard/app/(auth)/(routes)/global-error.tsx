'use client'

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h1>Something went wrong! Please try again!</h1>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  )
}