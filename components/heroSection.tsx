'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sora } from 'next/font/google'

const sora = Sora({ subsets: ['latin'] })

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#111" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#111" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#111" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

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
    <section className={`relative h-screen w-full mb-0 overflow-hidden bg-black ${sora.className}`}>
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
                src="/uploads/hero.png"
                alt="Hero Image"
                fill
                priority
                className={`object-cover object-center transition-opacity duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="100vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`absolute inset-0 bg-black ${isImageLoaded ? 'bg-opacity-50' : 'bg-opacity-100'} transition-all duration-500 flex items-center justify-center`}>
        <div className="text-center text-white">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={textVariants}
          >
   
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={textVariants}
          >
   
          </motion.p>
        </div>
      </div>
    </section>
  )
}