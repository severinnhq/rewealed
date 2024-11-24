"use client"
import React, { useState, useEffect } from 'react'
import { Product } from '../models/Product'
import Image from 'next/image'
import ProductEditForm from './ProductEditForm'

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setProducts(products.filter(p => p._id?.toString() !== productId))
        } else {
          throw new Error('Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p))
    setEditingProduct(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>
      {editingProduct ? (
        <ProductEditForm product={editingProduct} onUpdate={handleUpdateProduct} onCancel={() => setEditingProduct(null)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id?.toString()} className="border rounded-lg p-4 shadow-sm">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
              <div className="flex justify-between">
                <button 
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product._id!.toString())}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

