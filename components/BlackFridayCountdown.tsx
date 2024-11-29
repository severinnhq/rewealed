'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const BLACK_FRIDAY_DATE = new Date('2024-11-29T22:00:00-05:00') // 22:00 ET

export function BlackFridayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | Record<string, never>>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function calculateTimeLeft(): TimeLeft | Record<string, never> {
    const difference = +BLACK_FRIDAY_DATE - +new Date()
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return {}
  }

  const timeComponents = Object.entries(timeLeft).map(([interval, value]) => {
    if (!value) {
      return null
    }

    return (
      <motion.div
        key={interval}
        className="flex flex-col items-center mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span 
          className="text-6xl font-bold mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
        >
          {value}
        </motion.span>
        <span className="text-xl">{interval}</span>
      </motion.div>
    )
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">Black Friday Drop Countdown</h1>
      <div className="flex justify-center items-center">
        {timeComponents.length ? timeComponents : <span className="text-4xl">Time's up!</span>}
      </div>
      <p className="mt-8 text-xl text-center">
        The sale starts on November 29, 2024 at 22:00 ET
      </p>
    </div>
  )
}

