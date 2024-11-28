import React from 'react';
import { Hero } from '@/components/Hero';
import ProductList from '@/components/ProductList';
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main>
      <Hero>
        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
          Shop Now
        </Button>
      </Hero>
      <ProductList />
    </main>
  );
}

