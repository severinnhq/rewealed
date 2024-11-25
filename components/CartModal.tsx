"use client"
import React from 'react'
import Image from 'next/legacy/image'
import { useCart } from '../hooks/useCart'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function CartModal() {
  const { cart, isOpen, closeCart, selectSize, addToSidebar } = useCart()

  if (!isOpen || !cart) return null

  const availableSizes = cart.product.sizes || []

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border rounded-lg shadow-lg p-6 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cart</h2>
        <Button variant="ghost" size="sm" onClick={closeCart}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-24 h-24">
          <Image
            src={cart.product.image}
            alt={cart.product.name}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium">{cart.product.name}</h3>
          <p className="text-gray-600">${cart.product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Select Size:</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              variant={cart.selectedSize === size ? "default" : "outline"}
              size="sm"
              className={`${!availableSizes.includes(size) ? 'line-through opacity-50' : ''}`}
              onClick={() => availableSizes.includes(size) && selectSize(size)}
              disabled={!availableSizes.includes(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <Button 
        className="w-full" 
        disabled={!cart.selectedSize}
        onClick={() => {
          if (cart.selectedSize) {
            addToSidebar(cart.product, cart.selectedSize)
            closeCart()
          }
        }}
      >
        Add
      </Button>
    </div>
  )
}

