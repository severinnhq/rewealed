"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '../models/Product'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product._id?.toString()} className="border rounded-lg p-4 shadow-sm flex flex-col">
          <div className="relative w-full pb-[100%] mb-4">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <div className="mt-auto">
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            {product.salePrice && (
              <p className="text-sm text-red-600 line-through">${product.salePrice.toFixed(2)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

