'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface CartItem {
  product: {
    _id: string;
    name: string;
    mainImage: string;
    price: number;
    salePrice?: number;
  };
  size: string;
  quantity: number;
}

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
}

export function Header({ cartItems, onCartClick }: HeaderProps) {
  useEffect(() => {
    document.body.style.paddingTop = '64px'; 
    return () => {
      document.body.style.paddingTop = '0px';
    };
  }, []);

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Menu size={24} />
          <span className="sr-only">Menu</span>
        </Button>

        <div className="flex-grow flex justify-center">
          <Image
            src="/logo.png"
            alt="Store Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 hover:text-gray-900 relative"
          onClick={onCartClick}
        >
          <ShoppingCart size={24} />
          <span className="sr-only">Cart</span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}

