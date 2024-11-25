"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/legacy/image'
import { Product } from '../models/Product'
import { Button } from "@/components/ui/button"
import { useCart } from '../hooks/useCart'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()

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
        <div key={product._id?.toString()} className="border rounded-lg p-4 shadow-sm flex flex-col group relative">
          <div className="relative w-full pb-[100%] mb-4">
            <Image 
              src={product.image} 
              alt={product.name}
              layout="fill"
              objectFit="contain"
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
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={() => addToCart(product)} className="bg-white text-black hover:bg-gray-200">
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

