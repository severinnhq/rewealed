'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '../../../models/Product'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        console.log('Fetched products:', data) // Log the fetched data
        setProducts(data)
      } catch (err) {
        setError('Error fetching products. Please try again later.')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin: Product List</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id?.toString()} className="border rounded-lg p-4 shadow-md">
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={product.mainImage || '/placeholder.svg'}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md cursor-pointer"
                  onClick={() => setSelectedImage(product.mainImage)}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              {product.salePrice && (
                <p className="text-red-600 font-bold">Sale: ${product.salePrice.toFixed(2)}</p>
              )}
              {product.category && (
                <p className="text-sm text-gray-500">Category: {product.category}</p>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Sizes:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.sizes && product.sizes.map((size) => (
                    <span key={size} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              {product.gallery && product.gallery.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Gallery:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {product.gallery.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="max-w-3xl max-h-3xl">
            <img src={selectedImage} alt="Full size product image" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}

