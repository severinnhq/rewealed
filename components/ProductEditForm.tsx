"use client"
import React, { useState } from 'react'
import { Product } from '../models/Product'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Shirts', 'Pants', 'Dresses', 'Accessories', 'Shoes']

interface ProductEditFormProps {
  product: Product
  onUpdate: (updatedProduct: Product) => void
  onCancel: () => void
}

export default function ProductEditForm({ product, onUpdate, onCancel }: ProductEditFormProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'price' || name === 'salePrice') {
      const parsedValue = parseFloat(value)
      setEditedProduct(prev => ({ ...prev, [name]: isNaN(parsedValue) ? 0 : parsedValue }))
    } else {
      setEditedProduct(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSizeChange = (size: string) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes ? 
        (prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size])
        : [size]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isGallery) {
          setEditedProduct(prev => ({ 
            ...prev, 
            gallery: prev.gallery ? [...prev.gallery, reader.result as string] : [reader.result as string] 
          }))
        } else {
          setEditedProduct(prev => ({ ...prev, image: reader.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/products/${editedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const updatedProduct = await response.json()
      onUpdate(updatedProduct)
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
      console.error('Update error:', errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={editedProduct.name}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={editedProduct.description}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={editedProduct.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Sale Price (optional)</label>
        <input
          type="number"
          id="salePrice"
          name="salePrice"
          value={editedProduct.salePrice || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sizes</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 rounded ${
                editedProduct.sizes && editedProduct.sizes.includes(size)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={editedProduct.category}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Main Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) => handleImageUpload(e, false)}
          accept="image/*"
          className="mt-1 block w-full"
        />
        {editedProduct.image && (
          <img src={editedProduct.image} alt="Product" className="mt-2 h-32 object-contain" />
        )}
      </div>
      <div>
        <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">Gallery Images</label>
        <input
          type="file"
          id="gallery"
          name="gallery"
          onChange={(e) => handleImageUpload(e, true)}
          accept="image/*"
          multiple
          className="mt-1 block w-full"
        />
        {editedProduct.gallery && editedProduct.gallery.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {editedProduct.gallery.map((img, index) => (
              <img key={index} src={img} alt={`Gallery ${index + 1}`} className="h-32 object-contain" />
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button 
          type="submit" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? 'Updating...' : 'Update Product'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

