import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'

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

const useDelayedExpand = (delay: number = 300) => {
  const [shouldExpand, setShouldExpand] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldExpand(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return shouldExpand;
};

const CartModal: React.FC<CartModalProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const firstAvailableSize = product.sizes[0];
    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize);
    }
  }, [product.sizes]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAddToCart = () => {
    if (product.sizes.includes('One Size')) {
      onAddToCart('One Size')
      setIsOpen(false)
    } else if (selectedSize) {
      onAddToCart(selectedSize)
      setIsOpen(false)
    }
  }

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const shouldExpand = useDelayedExpand();

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <>
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsOpen(false)}
        />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: shouldExpand ? 'auto' : '4rem' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed bg-white rounded-t-lg md:rounded-lg shadow-lg w-full md:w-80 z-[60] overflow-hidden bottom-0 md:bottom-4 left-0 md:left-auto right-0 md:right-4 max-w-full"
          
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="p-4"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
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
                      <span className="text-red-600 font-bold">€{product.salePrice.toFixed(2)}</span>
                      <span className="text-gray-500 line-through ml-2">€{product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-bold">€{product.price.toFixed(2)}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Select Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.includes('One Size') ? (
                  <Button
                    variant="outline"
                    className={`w-24 h-12 ${selectedSize === 'One Size' ? 'border-2 border-black' : 'border border-gray-300'}`}
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
                        variant="outline"
                        className={`${size === 'One Size' ? "w-24 h-12" : "w-10 h-10"} p-0 
                          ${!isAvailable && "line-through opacity-50"} 
                          ${selectedSize === size ? 'border-2 border-black' : 'border border-gray-300'}
                        `}
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
              className="w-full bg-black text-white hover:bg-gray-800" 
              disabled={!selectedSize && !product.sizes.includes('One Size')}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartModal

