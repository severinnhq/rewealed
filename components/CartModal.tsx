"use client"
import React from 'react'
import Image from 'next/legacy/image'
import { useCart } from '../hooks/useCart'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

export default function CartModal() {
  const { cart, removeFromCart, isOpen, closeCart } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Cart</h2>
        <Button variant="ghost" size="sm" onClick={closeCart}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product._id?.toString()} className="flex items-center space-x-2">
              <div className="relative w-16 h-16">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium">{item.product.name}</h3>
                <p className="text-xs text-gray-500">Size: {item.size}</p>
                <p className="text-sm">${item.product.price.toFixed(2)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product._id?.toString() || '', item.size)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="mt-4">
            <Button className="w-full">Checkout</Button>
          </div>
        </div>
      )}
    </div>
  )
}

