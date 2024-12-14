'use client'

import React from 'react'
import HeroSection from '../components/heroSection'
import ProductList from '../components/ProductList'
import BlackFridayCountdown from '../components/BlackFridayCountdown'
import { useCountdown } from '@/lib/CountdownContext'
import CombinedGridLayout from '../components/ReviewSection'
import CombinedFAQAndContact from '../components/CombinedFAQAndContact'
import { ShippingFeatures } from '@/components/ShippingFeatures'
import ReviewSection from '../components/ReviewSection'

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
      <section id="review" className="py-16 w-full">
        <ReviewSection />
      </section>
  
      <section id="faq-and-contact" className="py-16">
        <CombinedFAQAndContact />
      </section>
    </main>
  )
}