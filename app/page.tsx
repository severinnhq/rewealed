'use client'

import { HeroSection } from '../components/heroSection'
import ProductList from '../components/ProductList'
import { BlackFridayCountdown } from '../components/BlackFridayCountdown'
import { useCountdown } from '@/lib/CountdownContext'
import React from 'react';

export default function Home() {
  const { setIsCountdownActive } = useCountdown()
  const SHOW_COUNTDOWN = false // Set this to false to show the normal page

  React.useEffect(() => {
    setIsCountdownActive(SHOW_COUNTDOWN)
  }, [setIsCountdownActive])

  if (SHOW_COUNTDOWN) {
    return <BlackFridayCountdown />
  }

  return (
    <main>
      <HeroSection />
      <ProductList />
    </main>
  )
}

