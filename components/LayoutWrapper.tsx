
'use client'

import React from 'react'
import { useCountdown } from '@/lib/CountdownContext'
import { CartProvider } from '@/lib/CartContext'
import Footer from '@/components/Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCountdownActive } = useCountdown()

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        {!isCountdownActive && <Footer />}
      </div>
    </CartProvider>
  )
}
