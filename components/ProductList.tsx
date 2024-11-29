'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import CartModal from "@/components/CartModal"
import Sidebar from "@/components/Sidebar"
import { Header } from './Header'
import { useCart } from '@/lib/CartContext'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

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

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartProduct, setCartProduct] = useState<Product | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set())
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const productRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart()

  const handleAddToCart = (product: Product) => {
    setCartProduct(product)
  }

  const handleCloseModal = () => {
    setCartProduct(null)
  }

  const handleConfirmAddToCart = (size: string) => {
    if (cartProduct) {
      addToCart(cartProduct, size, 1);
      setCartProduct(null);
      setIsSidebarOpen(true);
    }
  };

  const handleRemoveCartItem = (index: number) => {
    removeFromCart(index);
  }

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity);
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const productId = entry.target.id
          setVisibleProducts((prev) => new Set(prev).add(productId))
        }
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    })

    const currentProductRefs = productRefs.current

    currentProductRefs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      currentProductRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [products])

  return (
    <>
      <Header onCartClick={() => setIsSidebarOpen(true)} cartItems={cartItems} />
      <div className="container mx-auto p-4 mt-16">
        <h1 className="text-2xl font-bold mb-4">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div 
              key={product._id}
              id={product._id}
              ref={(el: HTMLDivElement | null) => { productRefs.current[index] = el }}
              className={`rounded-lg overflow-hidden bg-white relative group border-0 transition-opacity duration-500 ease-in-out cursor-pointer ${
                visibleProducts.has(product._id) ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => handleProductClick(product._id)}
            >
              <div 
                className="relative aspect-square overflow-hidden"
                onMouseEnter={() => setHoveredProduct(product._id)} 
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className={`absolute inset-0 transition-opacity duration-300 ease-out md:group-hover:opacity-0`}>
                  <Image
                    src={`/uploads/${product.mainImage}`}
                    alt={product.name}
                    fill
                    className="object-cover bg-transparent"
                  />
                </div>
                {product.galleryImages.length > 0 && (
                  <div className={`absolute inset-0 transition-opacity duration-300 ease-out opacity-0 md:group-hover:opacity-100`}>
                    <Image
                      src={`/uploads/${product.galleryImages[0]}`}
                      alt={`${product.name} - Gallery`}
                      fill
                      className="object-cover bg-transparent"
                    />
                  </div>
                )}
                <div className="absolute bottom-4 right-4 transform translate-y-1/4 transition-all duration-300 ease-out md:group-hover:translate-y-0 opacity-0 md:group-hover:opacity-100 hidden md:block">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className="bg-black text-white hover:bg-gray-800 text-sm py-1 px-3"
                  >
                    <span className="font-bold">+ Add to Cart</span>
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4 md:hidden">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className="bg-white text-black hover:bg-gray-100 p-2 rounded-full"
                  >
                    <ShoppingCart size={20} />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-black">{product.name}</h2>
                <div className="mt-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-lg font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-black">${product.price.toFixed(2)}</span>
                  )}
                </div>
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
        <Sidebar 
          cartItems={cartItems} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onRemoveItem={handleRemoveCartItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
    </>
  )
}

