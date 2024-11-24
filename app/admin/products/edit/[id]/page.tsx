'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  mainImage: string
  gallery?: string[]
  category?: string
  sizes?: string[]
  salePrice?: number
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError('Error fetching product. Please try again later.')
        console.error('Error fetching product:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSizeChange = (size: string) => {
    setProduct(prev => {
      if (!prev) return null
      const newSizes = prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
      return { ...prev, sizes: newSizes }
    })
  }

  const handleImageDelete = (imageUrl: string) => {
    setProduct(prev => {
      if (!prev) return null
      if (prev.mainImage === imageUrl) {
        return { ...prev, mainImage: prev.gallery?.[0] || '', gallery: prev.gallery?.filter(img => img !== imageUrl) }
      }
      return { ...prev, gallery: prev.gallery?.filter(img => img !== imageUrl) }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      router.push('/admin/products')
    } catch (err) {
      setError('Error updating product. Please try again.')
      console.error('Error updating product:', err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      router.push('/admin/products')
    } catch (err) {
      setError('Error deleting product. Please try again.')
      console.error('Error deleting product:', err)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={product.category || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sizes</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <label key={size} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={product.sizes?.includes(size)}
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
          <label className="block text-sm font-medium text-gray-700">Main Image</label>
          <div className="mt-2 flex items-center space-x-4">
            <Image
              src={product.mainImage}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-md"
            />
            <button
              type="button"
              onClick={() => handleImageDelete(product.mainImage)}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {product.gallery?.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(image)}
                  className="absolute top-0 right-0 px-2 py-1 bg-red-600 text-white text-xs rounded-bl-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Product
          </button>
        </div>
      </form>
    </div>
  )
}

