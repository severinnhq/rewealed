'use client'

import { useState, useEffect } from 'react'
import { ProductForm } from '@/components/ProductForm'
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

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch('/api/products')
    if (response.ok) {
      const data = await response.json()
      setProducts(data)
    }
  }

  const handleAddProduct = async (product: Omit<Product, '_id'>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    if (response.ok) {
      fetchProducts()
    }
  }

  const handleUpdateProduct = async (product: Omit<Product, '_id'>) => {
    if (!editingProduct) return

    const response = await fetch(`/api/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    if (response.ok) {
      setEditingProduct(null)
      fetchProducts()
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <ProductForm onSubmit={handleAddProduct} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border rounded p-4">
              {editingProduct && editingProduct._id === product._id ? (
                <ProductForm
                  initialProduct={editingProduct}
                  onSubmit={handleUpdateProduct}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="mt-2">Price: ${product.price.toFixed(2)}</p>
                  {product.salePrice && (
                    <p className="text-red-600">Sale Price: ${product.salePrice.toFixed(2)}</p>
                  )}
                  <p>Category: {product.category}</p>
                  <p>Sizes: {product.sizes.join(', ')}</p>
                  <Button onClick={() => handleEditClick(product)} className="mt-2">
                    Edit Product
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

