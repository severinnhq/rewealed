"use client"
import React, { useState } from 'react'
import { Product } from '../models/Product'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Shirts', 'Pants', 'Dresses', 'Accessories', 'Shoes']

export default function ProductUploadForm() {
  const [product, setProduct] = useState<Omit<Product, '_id'>>({
    name: '',
    description: '',
    price: 0,
    salePrice: undefined,
    sizes: [],
    category: '',
    image: '',
    gallery: [],
  })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'price' || name === 'salePrice') {
      const parsedValue = parseFloat(value)
      setProduct(prev => ({ ...prev, [name]: isNaN(parsedValue) ? 0 : parsedValue }))
    } else {
      setProduct(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSizeChange = (size: string) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes ? 
        (prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size])
        : [size]
    }))
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = Math.min(1, 1600 / img.width);
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = e.target.files
    if (files) {
      try {
        const compressedImages = await Promise.all(Array.from(files).map(compressImage));
        if (isGallery) {
          setProduct(prev => ({ 
            ...prev, 
            gallery: prev.gallery ? [...prev.gallery, ...compressedImages] : compressedImages 
          }))
        } else {
          setProduct(prev => ({ ...prev, image: compressedImages[0] }))
          const compressedSize = Math.round((compressedImages[0].length * 3) / 4);
          setImageSize(compressedSize);
        }
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Error processing image. Please try again.');
      }
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

      alert('Product uploaded successfully!')
      setProduct({ 
        name: '', 
        description: '', 
        price: 0, 
        salePrice: undefined, 
        sizes: [], 
        category: '', 
        image: '', 
        gallery: [] 
      })
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
        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Sale Price (optional)</label>
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
        <label className="block text-sm font-medium text-gray-700">Sizes</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 rounded ${
                product.sizes && product.sizes.includes(size)
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
          value={product.category}
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
          required
          className="mt-1 block w-full"
        />
        {imageSize && (
          <p className="mt-1 text-sm text-gray-500">
            Image size: {(imageSize / (1024 * 1024)).toFixed(2)} MB
          </p>
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
        {product.gallery && product.gallery.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {product.gallery.length} image(s) selected for gallery
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

