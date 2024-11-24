"use client"
import React, { useState } from 'react'
import { Product } from '../models/Product'

export default function ProductUploadForm() {
  const [product, setProduct] = useState<Omit<Product, '_id'>>({
    name: '',
    description: '',
    price: 0,
    image: '',
  })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'price') {
      const parsedValue = parseFloat(value)
      setProduct(prev => ({ ...prev, [name]: isNaN(parsedValue) ? 0 : parsedValue }))
    } else {
      setProduct(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageSize(file.size)
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        setError('Image size should be less than 20MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      alert('Product uploaded successfully!')
      setProduct({ name: '', description: '', price: 0, image: '' })
      setImageSize(null)
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = 'The request timed out. Please try again or upload a smaller image.'
      }
      setError(errorMessage)
      console.error('Upload error:', errorMessage)
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
          value={product.name}
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
          value={product.description}
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
          value={product.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageUpload}
          accept="image/*"
          required
          className="mt-1 block w-full"
        />
        {imageSize && (
          <p className="mt-1 text-sm text-gray-500">
            Image size: {(imageSize / (1024 * 1024)).toFixed(2)} MB
          </p>
        )}
      </div>
      <button 
        type="submit" 
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Product'}
      </button>
    </form>
  )
}

