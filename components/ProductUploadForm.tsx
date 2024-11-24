"use client"
import React, { useState } from 'react'
import { Product, Size } from '../models/Product'
import { resizeImage } from '../utils/imageUtils'
import { uploadFile } from '../utils/uploadUtils'

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductUploadForm() {
  const [product, setProduct] = useState<Omit<Product, '_id'>>({
    name: '',
    description: '',
    price: 0,
    mainImage: '',
    gallery: [],
    category: '',
    sizes: [],
    salePrice: undefined,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'price' || name === 'salePrice') {
      const parsedValue = parseFloat(value)
      setProduct(prev => ({ ...prev, [name]: isNaN(parsedValue) ? undefined : parsedValue }))
    } else {
      setProduct(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSizeChange = (size: Size) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const resizedImage = await resizeImage(file, 1920, 1080)
        const fileName = await uploadFile(new File([resizedImage], file.name, { type: resizedImage.type }), setUploadProgress)
        setProduct(prev => ({ ...prev, mainImage: `/uploads/${fileName}` }))
      } catch (error) {
        console.error('Error uploading image:', error)
        setError('Failed to upload the image. Please try again.')
      }
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []
      for (let i = 0; i < files.length; i++) {
        try {
          const resizedImage = await resizeImage(files[i], 1920, 1080)
          const fileName = await uploadFile(new File([resizedImage], files[i].name, { type: resizedImage.type }), setUploadProgress)
          newImages.push(`/uploads/${fileName}`)
        } catch (error) {
          console.error('Error uploading image:', error)
          setError('Failed to upload one or more images. Please try again.')
        }
      }
      setProduct(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      alert('Product upload complete!')
      setProduct({ name: '', description: '', price: 0, mainImage: '', gallery: [], category: '', sizes: [], salePrice: undefined })
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setError(errorMessage)
      console.error('Upload error:', errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={product.category}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sizes</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIZES.map(size => (
            <label key={size} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={product.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2">{size}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Sale Price</label>
        <input
          type="number"
          id="salePrice"
          name="salePrice"
          value={product.salePrice || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">Main Image</label>
        <input
          type="file"
          id="mainImage"
          name="mainImage"
          onChange={handleMainImageUpload}
          accept="image/*"
          required
          className="mt-1 block w-full"
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="bg-blue-100 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress.toFixed(0)}%</p>
          </div>
        )}
      </div>
      {product.mainImage && (
        <div className="mt-2">
          <img src={product.mainImage} alt="Main product image" className="w-full h-32 object-cover rounded-md" />
        </div>
      )}
      <div>
        <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">Gallery Images</label>
        <input
          type="file"
          id="gallery"
          name="gallery"
          onChange={handleGalleryUpload}
          accept="image/*"
          multiple
          className="mt-1 block w-full"
        />
      </div>
      {product.gallery.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {product.gallery.map((image, index) => (
            <img key={index} src={image} alt={`Gallery image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
          ))}
        </div>
      )}
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

