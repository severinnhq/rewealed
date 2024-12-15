'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sora } from 'next/font/google'

const sora = Sora({ subsets: ['latin'] })

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2 + i * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }),
  }

  return (
    <section className={`relative h-screen w-full overflow-hidden ${sora.className}`}>
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            key="hero-image"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            className="w-full h-full"
          >
            <picture>
              <source
                media="(max-width: 640px)"
                srcSet="/uploads/resp2.png?height=1080&width=640 640w"
                sizes="100vw"
              />
              <source
                media="(max-width: 1128px)"
                srcSet="/uploads/resp1.png?height=1080&width=1024 1024w"
                sizes="100vw"
              />
              <source
                media="(min-width: 1129px)"
                srcSet="/uploads/hero.png?height=1080&width=1920 1920w"
                sizes="100vw"
              />
              <Image
                src="/placeholder.svg?height=1080&width=1920"
                alt="Hero Image"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
                onLoad={() => setIsLoaded(true)}
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={textVariants}
          >
            Welcome to Our Site
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={textVariants}
          >
            Discover amazing content and experiences
          </motion.p>
        </div>
      </div>
    </section>
  )
}

