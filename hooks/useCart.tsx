"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../models/Product'

interface CartItem {
  product: Product
  selectedSize: string | null
}

interface CartContextType {
  cart: CartItem | null
  addToCart: (product: Product) => void
  removeFromCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  selectSize: (size: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCart({ product, selectedSize: null })
    setIsOpen(true)
  }

  const removeFromCart = () => {
    setCart(null)
    setIsOpen(false)
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const selectSize = (size: string) => {
    if (cart) {
      setCart({ ...cart, selectedSize: size })
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isOpen, openCart, closeCart, selectSize }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

