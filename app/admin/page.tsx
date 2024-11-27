'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function AdminPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [category, setCategory] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [newGalleryImage, setNewGalleryImage] = useState('')
  const router = useRouter()

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const handleAddGalleryImage = () => {
    if (newGalleryImage) {
      setGalleryImages(prev => [...prev, newGalleryImage])
      setNewGalleryImage('')
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        description, 
        price: parseFloat(price), 
        salePrice: salePrice ? parseFloat(salePrice) : null,
        mainImage,
        category,
        sizes: selectedSizes,
        galleryImages
      }),
    })
    if (response.ok) {
      setName('')
      setDescription('')
      setPrice('')
      setSalePrice('')
      setMainImage('')
      setCategory('')
      setSelectedSizes([])
      setGalleryImages([])
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="salePrice">Sale Price (optional)</Label>
          <Input
            type="number"
            id="salePrice"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="mainImage">Main Image Filename</Label>
          <Input
            id="mainImage"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="galleryImage">Gallery Images</Label>
          <div className="flex gap-2">
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
            {galleryImages.map((image, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <span>{image}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveGalleryImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </div>
  )
}

