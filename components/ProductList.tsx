'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded p-4">
            <Image
              src={`/uploads/${product.image}`}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover mb-2"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

