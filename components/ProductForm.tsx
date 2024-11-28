import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface ProductFormProps {
  initialProduct?: Product
  onSubmit: (product: Omit<Product, '_id'>) => void
  onCancel?: () => void
}

interface Product {
  _id?: string
  name: string
  description: string
  price: number
  salePrice?: number
  mainImage: string
  category: string
  sizes: string[]
  galleryImages: string[]
}

export function ProductForm({ initialProduct, onSubmit, onCancel }: ProductFormProps) {
  const [product, setProduct] = useState<Omit<Product, '_id'>>({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price || 0,
    salePrice: initialProduct?.salePrice,
    mainImage: initialProduct?.mainImage || '',
    category: initialProduct?.category || '',
    sizes: initialProduct?.sizes || [],
    galleryImages: initialProduct?.galleryImages || [],
  })
  const [newGalleryImage, setNewGalleryImage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSizeToggle = (size: string) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleAddGalleryImage = () => {
    if (newGalleryImage) {
      setProduct(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newGalleryImage]
      }))
      setNewGalleryImage('')
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(product)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <Label htmlFor="name" className="text-lg font-semibold">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="price" className="text-lg font-semibold">Price</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            step="0.01"
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="salePrice" className="text-lg font-semibold">Sale Price (optional)</Label>
          <Input
            type="number"
            id="salePrice"
            name="salePrice"
            value={product.salePrice || ''}
            onChange={handleChange}
            step="0.01"
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="category" className="text-lg font-semibold">Category</Label>
        <Input
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-lg font-semibold">Sizes</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              variant={product.sizes.includes(size) ? "default" : "outline"}
              className="w-12 h-12 rounded-full"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="mainImage" className="text-lg font-semibold">Main Image Filename</Label>
        <Input
          id="mainImage"
          name="mainImage"
          value={product.mainImage}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="galleryImage" className="text-lg font-semibold">Gallery Images</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="galleryImage"
            value={newGalleryImage}
            onChange={(e) => setNewGalleryImage(e.target.value)}
            placeholder="Enter image filename"
          />
          <Button type="button" onClick={handleAddGalleryImage}>
            Add Image
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.galleryImages.map((image, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
              <span>{image}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveGalleryImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialProduct ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}

