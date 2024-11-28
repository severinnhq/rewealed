import React, { ReactNode } from 'react';
import Image from 'next/image';

interface HeroProps {
  children?: ReactNode;
}

export function Hero({ children }: HeroProps) {
  return (
    <section className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-background.jpg"
        alt="Hero background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl md:text-2xl mb-8">Discover amazing products at unbeatable prices</p>
        {children}
      </div>
    </section>
  );
}

