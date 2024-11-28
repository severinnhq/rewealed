'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

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
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({})

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

  const handleImageSelect = (productId: string, image: string | null) => {
    setSelectedImages(prev => ({
      ...prev,
      [productId]: image || ''
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded p-4">
            <div className="relative aspect-square mb-2">
              <Image
                src={`/uploads/${selectedImages[product._id] || product.mainImage}`}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
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
    </div>
  )
}

