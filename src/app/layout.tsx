import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { KeyboardProvider } from '@/components/keyboard/keyboard-provider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sniper - AI-Powered Sales Email Client',
  description: 'Superhuman-like email client for sales teams powered by AI agents',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <NuqsAdapter>
          <TooltipProvider>
            <KeyboardProvider>
              {children}
              <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'hsl(0 0% 10%)',
                    border: '1px solid hsl(0 0% 20%)',
                    color: 'hsl(0 0% 98%)',
                  },
                }}
              />
            </KeyboardProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
