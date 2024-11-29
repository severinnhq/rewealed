'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Header } from '@/components/Header'
import { useCart } from '@/lib/CartContext'
import { Minus, Plus } from 'lucide-react'
import Sidebar from "@/components/Sidebar"
import { loadStripe } from '@stripe/stripe-js'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  salePrice?: number
  mainImage: string
  category: string
  sizes: string[]
  galleryImages: string[]
}

export default function ProductQuickview() {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { id } = useParams()
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, selectedSize, quantity)
      setIsSidebarOpen(true)
    }
  }

  const handleRemoveCartItem = (index: number) => {
    removeFromCart(index)
    if (cartItems.length === 1) {
      setIsSidebarOpen(false)
    }
  }

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity)
  }

  const handleCheckout = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      })

      if (response.ok) {
        const { sessionId } = await response.json()
        const result = await stripe?.redirectToCheckout({ sessionId })

        if (result?.error) {
          console.error('Stripe redirect error:', result.error)
        } else {
          clearCart()
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to create checkout session:', errorData)
        alert(`Checkout failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header cartItems={cartItems} onCartClick={() => setIsSidebarOpen(true)} />
      <div className="container mx-auto p-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={`/uploads/${product.mainImage}`}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.galleryImages.map((image, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={`/uploads/${image}`}
                    alt={`${product.name} gallery image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div>
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                  <span className="text-xl text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
            <p className="text-gray-600">{product.description}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={`${size === 'One Size' ? "w-24 h-12" : "w-12 h-12"} rounded-full`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="mx-2 w-16 text-center border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <Sidebar 
        isOpen={isSidebarOpen}
        cartItems={cartItems} 
        onClose={() => setIsSidebarOpen(false)} 
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </>
  )
}

