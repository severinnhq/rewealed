'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import CartModal from './CartModal'
import Sidebar from './Sidebar'
import { useCart } from '@/lib/CartContext'

interface Product {
  _id: string
  name: string
  price: number
  salePrice?: number
  mainImage: string
  categories: string[]
  sizes: string[]
}

export default function CapsSection() {
  const [capsProducts, setCapsProducts] = useState<Product[]>([])
  const [cartProduct, setCartProduct] = useState<Product | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart()

  useEffect(() => {
    fetchCapsProducts()
  }, [])

  const fetchCapsProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data: Product[] = await response.json()
        const filteredCaps = data
          .filter(product => product.categories.includes('caps'))
          .map((product) => ({
            ...product,
            price: Number(product.price) || 0,
            salePrice: product.salePrice ? Number(product.salePrice) || 0 : undefined,
            categories: Array.isArray(product.categories) ? product.categories : [product.categories].filter(Boolean)
          }))
        setCapsProducts(filteredCaps)
      } else {
        console.error('Failed to fetch caps products')
      }
    } catch (error) {
      console.error('Error fetching caps products:', error)
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  const handleAddToCart = (product: Product) => {
    setCartProduct(product)
  }

  const handleCloseModal = () => {
    setCartProduct(null)
  }

  const handleConfirmAddToCart = (size: string) => {
    if (cartProduct) {
      addToCart(cartProduct, size, 1)
      setCartProduct(null)
      setIsSidebarOpen(true)
    }
  }

  const handleRemoveCartItem = (index: number) => {
    removeFromCart(index)
  }

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity)
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold mb-8 text-center uppercase tracking-wider">Our Caps Collection</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {capsProducts.map((product) => (
          <div 
            key={product._id}
            className="rounded-lg overflow-hidden bg-white relative group border-0 transition-all duration-500 ease-in-out cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="relative aspect-square overflow-hidden">
              {product.salePrice && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg z-20">
                  SALE
                </div>
              )}
              <Image
                src={`/uploads/${product.mainImage}`}
                alt={product.name}
                fill
                className="object-cover bg-transparent"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                  className="bg-white text-black hover:bg-gray-200 text-sm py-2 px-4"
                >
                  + Add to Cart
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-black">{product.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                {product.salePrice ? (
                  <>
                    <span className="text-lg font-bold text-red-600">
                      €{product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      €{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-black">
                    €{product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button 
          onClick={() => router.push('/category/caps')}
          className="bg-black text-white hover:bg-gray-800 text-lg py-3 px-6"
        >
          View All Caps
        </Button>
      </div>
      {cartProduct && (
        <CartModal 
          product={cartProduct} 
          onClose={handleCloseModal} 
          onAddToCart={handleConfirmAddToCart} 
        />
      )}
      <Sidebar 
        cartItems={cartItems} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  )
}

