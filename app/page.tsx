'use client'

import  HeroSection  from '../components/heroSection'
import ProductList from '../components/ProductList'
import BlackFridayCountdown from '../components/BlackFridayCountdown'
import { useCountdown } from '@/lib/CountdownContext'
import { ShippingFeatures } from '@/components/ShippingFeatures'
import ContactSection from '../components/ContactSection'
import React from 'react';

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
    <main>
      <section id="hero">
        <HeroSection />
      </section>
      <section id="products">
        <ProductList />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <section id="shipping">
        <ShippingFeatures />
      </section>
    
    </main>
  )
}