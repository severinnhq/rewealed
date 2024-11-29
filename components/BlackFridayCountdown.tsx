'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const DROP_TIME = new Date()
DROP_TIME.setHours(22, 0, 0, 0) // Set to 10:00 PM today

export default function BlackFridayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function calculateTimeLeft(): TimeLeft {
    const difference = +DROP_TIME - +new Date()
    
    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return { hours: 0, minutes: 0, seconds: 0 }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been added to our notification list.",
        })
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    }
  }

  const timeComponents = Object.entries(timeLeft).map(([interval, value]) => (
    <motion.div
      key={interval}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-5xl md:text-7xl font-bold mb-2 text-gray-800">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-lg md:text-xl text-gray-600 capitalize">{interval}</span>
    </motion.div>
  ))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Image
          src="/logo.png"
          alt="Store Logo"
          width={200}
          height={67}
          className="object-contain"
        />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl font-extrabold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-sky-400">
          Black Friday Drop
        </span>
        <span className="ml-2 animate-bounce inline-block">🛍️</span>
      </motion.h1>
      
      <motion.div 
        className="flex justify-center items-center mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="grid grid-cols-3 gap-8">
          {timeComponents}
        </div>
      </motion.div>
      
      <motion.p 
        className="text-2xl md:text-3xl text-center text-gray-600 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        The sale starts today at 10:00 PM
      </motion.p>
      
      <motion.form
        className="flex flex-col items-center gap-4 w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-12 border-2 border-gray-300 focus:border-black transition-colors duration-200"
        />
        <Button 
          type="submit" 
          className="w-full px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200"
        >
          Notify Me
        </Button>
      </motion.form>
    </div>
  )
}

