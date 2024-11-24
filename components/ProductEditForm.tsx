"use client"
import React, { useState } from 'react'
import { Product } from '../models/Product'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Shirts', 'Pants', 'Dresses', 'Accessories', 'Shoes']

interface ProductEditFormProps {
  product: Product
  onSave: (updatedProduct: Product) => void
  onCancel: () => void
}

export default function ProductEditForm({ product, onSave, onCancel }: ProductEditFormProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSizeChange = (size: string) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes ? 
        (prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size])
        : [size]
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = e.target.files
    if (files) {
      try {
        const compressedImages = await Promise.all(Array.from(files).map(compressImage))
        if (isGallery) {
          setEditedProduct(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...compressedImages] }))
        } else {
          setEditedProduct(prev => ({ ...prev, image: compressedImages[0] }))
        }
      } catch (error) {
        console.error('Error compressing image:', error)
      }
    }
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const scaleFactor = Math.min(1, 1600 / img.width)
          canvas.width = img.width * scaleFactor
          canvas.height = img.height * scaleFactor
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      const response = await fetch(`/api/products?id=${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      onSave(editedProduct)
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={editedProduct.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={editedProduct.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          id="price"
          name="price"
          value={editedProduct.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="salePrice">Sale Price (optional)</Label>
        <Input
          type="number"
          id="salePrice"
          name="salePrice"
          value={editedProduct.salePrice || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label>Sizes</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {SIZES.map(size => (
            <Button
              key={size}
              type="button"
              variant={editedProduct.sizes?.includes(size) ? "default" : "outline"}
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          value={editedProduct.category}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="image">Main Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          onChange={(e) => handleImageUpload(e, false)}
          accept="image/*"
        />
      </div>
      <div>
        <Label htmlFor="gallery">Gallery Images</Label>
        <Input
          type="file"
          id="gallery"
          name="gallery"
          onChange={(e) => handleImageUpload(e, true)}
          accept="image/*"
          multiple
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

