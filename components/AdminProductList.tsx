"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '../models/Product'
import { Trash2, Edit, X } from 'lucide-react'
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

  const deleteImage = async (productId: string, imageUrl: string, isMainImage: boolean) => {
    try {
      const response = await fetch(`/api/products/image?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, isMainImage }),
      })
      if (response.ok) {
        setProducts(products.map(product => {
          if (product._id?.toString() === productId) {
            if (isMainImage) {
              return { ...product, image: '' }
            } else {
              return { ...product, gallery: product.gallery?.filter(img => img !== imageUrl) }
            }
          }
          return product
        }))
      } else {
        throw new Error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
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
              <div className="w-full md:w-1/3 space-y-4">
                <div className="relative">
                  <Image 
                    src={product.image || '/placeholder.svg'} 
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded object-cover w-full h-[300px]"
                  />
                  {product.image && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => deleteImage(product._id!.toString(), product.image, true)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.gallery?.map((img, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={img}
                        alt={`Gallery image ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded object-cover w-full h-[100px]"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => deleteImage(product._id!.toString(), img, false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center gap-4 mb-2">
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                  {product.salePrice != null && typeof product.salePrice === 'number' && (
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

