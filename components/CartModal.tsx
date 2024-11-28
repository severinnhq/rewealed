import React, { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Product {
  _id: string
  name: string
  price: number
  salePrice?: number
  mainImage: string
  sizes: string[]
}

interface CartModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (size: string) => void
}

const CartModal: React.FC<CartModalProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const handleAddToCart = () => {
    if (product.sizes.includes('One Size')) {
      onAddToCart('One Size')
      onClose()
    } else if (selectedSize) {
      onAddToCart(selectedSize)
      onClose()
    }
  }

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80 z-50">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <X size={20} />
      </button>
      <div className="flex items-center mb-4">
        <Image
          src={`/uploads/${product.mainImage}`}
          alt={product.name}
          width={80}
          height={80}
          className="rounded object-cover mr-4"
        />
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-bold">${product.salePrice.toFixed(2)}</span>
                <span className="text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Select Size:</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.includes('One Size') ? (
            <Button
              variant="default"
              className="w-24 h-12 bg-white text-black border-gray-300"
              onClick={() => setSelectedSize('One Size')}
            >
              One Size
            </Button>
          ) : (
            allSizes.map((size) => {
              const isAvailable = product.sizes.includes(size)
              return (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={`${size === 'One Size' ? "w-24 h-12" : "w-10 h-10"} p-0 ${!isAvailable && "line-through opacity-50"} bg-white text-black border-gray-300`}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  disabled={!isAvailable}
                >
                  {size}
                </Button>
              )
            })
          )}
        </div>
      </div>
      <Button 
        className="w-full" 
        disabled={!selectedSize && !product.sizes.includes('One Size')}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  )
}

export default CartModal

