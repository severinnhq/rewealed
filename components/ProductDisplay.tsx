import React from 'react'
import Image from 'next/image'
import { Product } from '../models/Product'

interface ProductDisplayProps {
  products: Product[]
}

export default function ProductDisplay({ products }: ProductDisplayProps) {
  if (!products || products.length === 0) return <div>No products found.</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id?.toString()} className="border rounded-lg p-4 shadow-sm">
          <div className="relative w-full h-64 mb-4">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-lg font-bold mb-2">
            ${product.price.toFixed(2)}
            {product.salePrice && (
              <span className="text-red-500 ml-2 line-through">${product.salePrice.toFixed(2)}</span>
            )}
          </p>
          <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.sizes.map((size) => (
              <span key={size} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                {size}
              </span>
            ))}
          </div>
          {product.gallery && product.gallery.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Gallery:</h3>
              <div className="flex flex-wrap gap-2">
                {product.gallery.map((img, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <Image 
                      src={img} 
                      alt={`${product.name} gallery image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

