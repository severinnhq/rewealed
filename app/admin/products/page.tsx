'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  _id?: string
  name: string
  description: string
  price: number
  mainImage: string
  gallery?: string[]
  category?: string
  sizes?: string[]
  salePrice?: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data: Product[] = await response.json()
      setProducts(data)
    } catch (err) {
      setError('Error fetching products. Please try again later.')
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Failed to delete product. Please try again.')
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    const data = await response.json()
    return data.fileName
  }

  async function updateProduct(product: Product) {
    try {
      let updatedProduct = { ...product }

      if (product.mainImage && product.mainImage.startsWith('data:')) {
        const file = dataURItoFile(product.mainImage, 'mainImage.jpg')
        const uploadedFileName = await uploadFile(file)
        updatedProduct.mainImage = `/uploads/${uploadedFileName}`
      }

      if (product.gallery) {
        const updatedGallery = await Promise.all(
          product.gallery.map(async (img) => {
            if (img.startsWith('data:')) {
              const file = dataURItoFile(img, 'galleryImage.jpg')
              const uploadedFileName = await uploadFile(file)
              return `/uploads/${uploadedFileName}`
            }
            return img
          })
        )
        updatedProduct.gallery = updatedGallery
      }

      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      fetchProducts()
      setEditingProduct(null)
    } catch (err) {
      console.error('Error updating product:', err)
      alert('Failed to update product. Please try again.')
    }
  }

  async function deleteImage(productId: string, imageUrl: string) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      fetchProducts()
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image. Please try again.')
    }
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [e.target.name]: e.target.value,
      })
    }
  }

  function handleSizeChange(size: string) {
    if (editingProduct) {
      const updatedSizes = editingProduct.sizes?.includes(size)
        ? editingProduct.sizes.filter(s => s !== size)
        : [...(editingProduct.sizes || []), size]
      setEditingProduct({
        ...editingProduct,
        sizes: updatedSizes,
      })
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean) {
    if (editingProduct && e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isMainImage) {
          setEditingProduct({
            ...editingProduct,
            mainImage: reader.result as string,
          })
        } else {
          setEditingProduct({
            ...editingProduct,
            gallery: [...(editingProduct.gallery || []), reader.result as string],
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  function dataURItoFile(dataURI: string, fileName: string): File {
    const arr = dataURI.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin: Product List</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md">
              {editingProduct && editingProduct._id === product._id ? (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  updateProduct(editingProduct)
                }}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={editingProduct.description}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                    <input
                      type="number"
                      name="salePrice"
                      value={editingProduct.salePrice ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          salePrice: value
                        });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editingProduct.category || ''}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Sizes</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <label key={size} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={editingProduct.sizes?.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Main Image</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="mt-1 block w-full"
                    />
                    {editingProduct.mainImage && (
                      <img src={editingProduct.mainImage} alt="Main" className="mt-2 h-20 object-cover" />
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="mt-1 block w-full"
                      multiple
                    />
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {editingProduct.gallery?.map((image, index) => (
                        <div key={index} className="relative group">
                          <img src={image} alt={`Gallery ${index}`} className="h-20 object-cover rounded-md" />
                          <button
                            onClick={() => {
                              if (editingProduct._id) {
                                deleteImage(editingProduct._id, image)
                                setEditingProduct({
                                  ...editingProduct,
                                  gallery: editingProduct.gallery?.filter((img) => img !== image),
                                })
                              }
                            }}
                            className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete image"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px
-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={product.mainImage || '/placeholder.svg'}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md cursor-pointer"
                      onClick={() => setSelectedImage(product.mainImage)}
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                  {typeof product.salePrice === 'number' && (
                    <p className="text-red-600 font-bold">Sale: ${product.salePrice.toFixed(2)}</p>
                  )}
                  {product.category && (
                    <p className="text-sm text-gray-500">Category: {product.category}</p>
                  )}
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Sizes:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.sizes && product.sizes.map((size) => (
                        <span key={size} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  {product.gallery && product.gallery.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Image Gallery:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {product.gallery.map((image, index) => (
                          <div key={index} className="relative w-full h-20 group">
                            <Image
                              src={image}
                              alt={`${product.name} - Image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                            />
                            <button
                              onClick={() => product._id && deleteImage(product._id, image)}
                              className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Delete image"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={() => product._id && deleteProduct(product._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete Product
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="max-w-3xl max-h-3xl relative">
            <Image
              src={selectedImage}
              alt="Full size product image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

