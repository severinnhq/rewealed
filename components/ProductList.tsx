'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import CartModal from "@/components/CartModal"
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

interface CartItem {
  product: Product
  size: string
  quantity: number
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [cartProduct, setCartProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    }
    fetchProducts()

    const savedCartItems = localStorage.getItem('cartItems')
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems))
      setIsSidebarOpen(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const handleImageSelect = (productId: string, image: string | null) => {
    setSelectedImages(prev => ({
      ...prev,
      [productId]: image || ''
    }))
  }

  const handleAddToCart = (product: Product) => {
    setIsSidebarOpen(false)
    setCartProduct(product)
  }

  const handleCloseModal = () => {
    setCartProduct(null)
  }

  const handleConfirmAddToCart = (size: string) => {
    if (cartProduct) {
      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(
          item => item.product._id === cartProduct._id && item.size === size
        );
        if (existingItemIndex > -1) {
          return prev.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { product: cartProduct, size, quantity: 1 }];
        }
      });
      setCartProduct(null);
      setIsSidebarOpen(true);
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
    if (cartItems.length === 1) {
      setIsSidebarOpen(false);
    }
  }

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index].quantity = newQuantity;
      return newItems;
    });
  }

  const handleCheckout = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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
        console.error(result.error)
      }
    } else {
      console.error('Failed to create checkout session')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="border rounded p-4 relative group"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative aspect-square mb-2">
              <Image
                src={`/uploads/${selectedImages[product._id] || product.mainImage}`}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
              {hoveredProduct === product._id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
            {product.galleryImages && product.galleryImages.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageSelect(product._id, null)}
                  className="flex-shrink-0"
                >
                  Main
                </Button>
                {product.galleryImages.map((image, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleImageSelect(product._id, image)}
                    className="flex-shrink-0"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((size) => (
                  <span key={size} className="px-2 py-1 bg-gray-200 rounded text-sm">
                    {size}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2">
              {product.salePrice ? (
                <>
                  <span className="text-lg font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {cartProduct && (
        <CartModal 
          product={cartProduct} 
          onClose={handleCloseModal} 
          onAddToCart={handleConfirmAddToCart} 
        />
      )}
      {isSidebarOpen && (
        <Sidebar 
          cartItems={cartItems} 
          onClose={() => setIsSidebarOpen(false)} 
          onRemoveItem={handleRemoveCartItem}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  )
}

