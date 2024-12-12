'use client'

import React from 'react'
import HeroSection from '../components/heroSection'
import ProductList from '../components/ProductList'
import BlackFridayCountdown from '../components/BlackFridayCountdown'
import { useCountdown } from '@/lib/CountdownContext'
import CombinedGridLayout from '../components/CombinedGridLayout'
import CombinedFAQAndContact from '../components/CombinedFAQAndContact'
import { ShippingFeatures } from '@/components/ShippingFeatures'

const SHOW_COUNTDOWN = false // Set this to false to show the normal page

export default function Home() {
  const { setIsCountdownActive } = useCountdown()

  React.useEffect(() => {
    setIsCountdownActive(SHOW_COUNTDOWN)
  }, [setIsCountdownActive])

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
        <CombinedGridLayout />
      </section>
   
       <ShippingFeatures />
      <section id="faq-and-contact" className="py-16">
        <CombinedFAQAndContact />
      </section>
    </main>
  )
}
