'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '../../../models/Product'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id?.toString()} className="border rounded-lg p-4 shadow-md">
            <div className="relative w-full h-64 mb-4">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
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
            {product.size && (
              <p className="text-sm text-gray-500">Size: {product.size}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

