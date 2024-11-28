'use client'

import Image from 'next/image'
import { Button } from "@/components/ui/button"

export function HeroSection() {

  return (
    <div 
      className="relative w-full h-screen mt-[-64px] bg-gray-900 text-white overflow-hidden"
    >
      <Image
        src="/hero-background.jpg"
        alt="Hero background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">Discover our latest collection of premium products designed to elevate your lifestyle.</p>
        <Button size="lg" className="text-lg px-8 py-3">
          Shop Now
        </Button>
      </div>
    </div>
  )
}

