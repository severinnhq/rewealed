"use client"
import React from 'react'
import Image from 'next/legacy/image'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCart, SidebarItem } from '../hooks/useCart'
import { Button } from "@/components/ui/button"

export default function CartSidebar() {
  const { sidebarItems, removeSidebarItem, addToSidebar, isSidebarOpen, closeSidebar } = useCart()

  const handleIncreaseQuantity = (item: SidebarItem) => {
    addToSidebar(item.product, item.size)
  }

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {sidebarItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 border-b pb-4">
              <div className="relative w-20 h-20">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{item.product.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <span className="mr-2">Quantity: {item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => removeSidebarItem(index)}>
                    Remove
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleIncreaseQuantity(item)} className="ml-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sidebarItems.length > 0 && (
          <div className="mt-6">
            <Button className="w-full">Proceed to Checkout</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

