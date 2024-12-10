'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import CartModal from './CartModal'
import Sidebar from './Sidebar'
import { useCart } from '@/lib/CartContext'
import { ShoppingCart } from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  salePrice?: number
  mainImage: string
  galleryImages: string[]
  categories: string[]
  sizes: string[]
}

export default function CapsSection() {
  const [capsProducts, setCapsProducts] = useState<Product[]>([])
  const [cartProduct, setCartProduct] = useState<Product | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart()

  useEffect(() => {
    fetchCapsProducts()
  }, [])

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
    }
  }, []);

  const fetchCapsProducts = async () => {
    setIsLoading(true)
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
            categories: Array.isArray(product.categories) ? product.categories : [product.categories].filter(Boolean),
            galleryImages: Array.isArray(product.galleryImages) ? product.galleryImages : []
          }))
        setCapsProducts(filteredCaps)
      } else {
        console.error('Failed to fetch caps products')
      }
    } catch (error) {
      console.error('Error fetching caps products:', error)
    } finally {
      setIsLoading(false)
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

  const ProductCard = ({ product, isLarge = false }: { product: Product, isLarge?: boolean }) => (
    <div 
      className={`relative bg-white cursor-pointer group ${
        isLarge 
          ? 'w-full md:w-[450px] h-[450px] md:h-[570px]' 
          : 'w-full md:w-[280px] h-[280px]'
      }`}
      onClick={() => handleProductClick(product._id)}
    >
      <div className={`relative overflow-hidden ${
        isLarge 
          ? 'h-[390px] md:h-[510px]' 
          : 'h-[220px]'
      }`}>
        <Image
          src={`/uploads/${product.mainImage}`}
          alt={product.name}
          fill
          className="object-contain transition-opacity duration-300 ease-out group-hover:opacity-0"
        />
        {product.galleryImages.length > 0 && (
          <Image
            src={`/uploads/${product.galleryImages[0]}`}
            alt={`${product.name} - Gallery`}
            fill
            className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
          />
        )}
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        <Button 
          onClick={(e) => {
            e.stopPropagation()
            handleAddToCart(product)
          }}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out bg-black text-white hover:bg-gray-800 px-3 py-1 md:px-4 md:py-2 text-base md:text-lg font-bold"
        >
          + Add
        </Button>
      </div>
      <div className="p-2">
        <h3 className={`font-semibold text-black truncate ${isLarge ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>{product.name}</h3>
        <div className="mt-1 flex items-center">
          {product.salePrice ? (
            <>
              <span className={`font-bold text-red-600 ${isLarge ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
                €{product.salePrice.toFixed(2)}
              </span>
              <span className={`text-gray-500 line-through ml-2 ${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
                €{product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className={`font-bold text-black ${isLarge ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
              €{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .touch-device .group:active .opacity-0 {
        opacity: 1;
      }
      .touch-device .group:active .translate-y-full {
        transform: translateY(0);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-0 py-8 max-w-[1300px]">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center uppercase tracking-wider">Our Caps Collection</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : capsProducts.length === 0 ? (
        <div className="text-center">No caps available at the moment.</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-24">
            <div className="w-full md:w-auto">
              {capsProducts[0] && <ProductCard product={capsProducts[0]} isLarge={true} />}
            </div>
            <div className="flex flex-row md:flex-col justify-center gap-6 md:gap-6 w-full md:w-auto">
              {capsProducts.slice(1, 3).map((product) => (
                <div key={product._id} className="w-1/2 md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          {capsProducts.length > 3 && (
            <div className="flex justify-center gap-6 md:gap-12 mt-6 flex-wrap">
              {capsProducts.slice(3, 7).map((product) => (
                <div key={product._id} className="mt-6 w-1/2 md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
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

