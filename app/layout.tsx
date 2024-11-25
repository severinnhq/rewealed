import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '../hooks/useCart'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Your Clothing Brand Webstore',
  description: 'Shop the latest fashion trends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

