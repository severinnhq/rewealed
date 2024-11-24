"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '../models/Product'
import { Trash2, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import ProductEditForm from './ProductEditForm'

export default function AdminProductList() {
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

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setProducts(products.filter(product => product._id?.toString() !== id))
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleSave = (updatedProduct: Product) => {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p))
    setEditingProduct(null)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product._id?.toString()} className="border rounded-lg p-6 shadow-sm">
          {editingProduct && editingProduct._id === product._id ? (
            <ProductEditForm 
              product={editingProduct} 
              onSave={handleSave} 
              onCancel={handleCancelEdit} 
            />
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-1/4 aspect-square">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center gap-4 mb-2">
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                  {product.salePrice && (
                    <p className="text-sm text-red-600 line-through">${product.salePrice.toFixed(2)}</p>
                  )}
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-sm text-gray-500 mb-2">Sizes: {product.sizes.join(', ')}</p>
                )}
                {product.category && (
                  <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                )}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => product._id && deleteProduct(product._id.toString())}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

