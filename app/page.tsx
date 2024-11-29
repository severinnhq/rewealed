'use client'

import { HeroSection } from '../components/heroSection'
import ProductList from '../components/ProductList'
import { BlackFridayCountdown } from '../components/BlackFridayCountdown'
import { useCountdown } from '@/lib/CountdownContext'
import React from 'react';

const SHOW_COUNTDOWN = true // Set this to false to show the normal page

export default function Home() {
  const { setIsCountdownActive } = useCountdown()

  React.useEffect(() => {
    setIsCountdownActive(SHOW_COUNTDOWN)
  }, [setIsCountdownActive, SHOW_COUNTDOWN])

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

