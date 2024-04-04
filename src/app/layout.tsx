import type { Metadata } from 'next'

import { ClubProvider } from '@/hooks/use-club'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'

import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'clubmn',
  description: 'a club management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontSans.variable}`}>
      <body
        className={cn(
          'bg-background mx-16 flex min-h-screen flex-col items-center antialiased'
        )}
      >
        <ClubProvider>
          <Toaster position="bottom-center" richColors />
          {children}
          <footer className="text-muted-foreground my-6 w-full max-w-5xl text-left text-sm leading-loose">
            © 2024
          </footer>
        </ClubProvider>
      </body>
    </html>
  )
}
