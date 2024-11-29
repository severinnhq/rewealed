import { CountdownProvider } from '@/lib/CountdownContext'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CountdownProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </CountdownProvider>
      </body>
    </html>
  )
}

