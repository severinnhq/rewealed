"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../models/Product'

interface CartItem {
  product: Product
  selectedSize: string | null
}

interface SidebarItem {
  product: Product
  size: string
}

interface CartContextType {
  cart: CartItem | null
  addToCart: (product: Product) => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  selectSize: (size: string) => void
  sidebarItems: SidebarItem[]
  addToSidebar: (product: Product, size: string) => void
  removeSidebarItem: (index: number) => void
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCart({ product, selectedSize: null })
    setIsOpen(true)
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const selectSize = (size: string) => {
    if (cart) {
      setCart({ ...cart, selectedSize: size })
    }
  }

  const addToSidebar = (product: Product, size: string) => {
    setSidebarItems([...sidebarItems, { product, size }])
    setIsSidebarOpen(true)
  }

  const removeSidebarItem = (index: number) => {
    setSidebarItems(sidebarItems.filter((_, i) => i !== index))
  }

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        isOpen, 
        openCart, 
        closeCart, 
        selectSize,
        sidebarItems,
        addToSidebar,
        removeSidebarItem,
        isSidebarOpen,
        openSidebar,
        closeSidebar
      }}
    >
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

