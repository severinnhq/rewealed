"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../models/Product'

interface CartItem {
  product: Product
  size: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string, size: string) => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, { product, size: product.sizes?.[0] || 'One Size' }])
    setIsOpen(true)
  }

  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.product._id?.toString() === productId && item.size === size)))
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isOpen, openCart, closeCart }}>
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

