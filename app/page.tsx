'use client'

import React, { useState, useEffect } from 'react'
import HeroSection from '../components/heroSection'
import ProductList from '../components/ProductList'
import BlackFridayCountdown from '../components/BlackFridayCountdown'
import { useCountdown } from '@/lib/CountdownContext'
import ContactSection from '../components/ContactSection'
import CombinedGridLayout from '../components/CombinedGridLayout'

const SHOW_COUNTDOWN = false // Set this to false to show the normal page

export default function Home() {
  const { setIsCountdownActive } = useCountdown()
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)

  useEffect(() => {
    setIsCountdownActive(SHOW_COUNTDOWN)
  }, [setIsCountdownActive])

  const toggleCartModal = () => {
    setIsCartModalOpen(prev => !prev)
  }

  if (SHOW_COUNTDOWN) {
    return <BlackFridayCountdown />
  }

  return (
    <main className="flex flex-col min-h-screen">
      <section id="hero">
        <HeroSection />
      </section>
      <section id="products">
        <ProductList />
      </section>
      <section id="combined-grid" className="py-16 w-full">
        <CombinedGridLayout isCartModalOpen={isCartModalOpen} />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  )
}

