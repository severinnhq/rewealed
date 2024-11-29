'use client'

import React, { useState, useEffect } from 'react'
import { X, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCheckout } from '@/lib/useCheckout'
import { usePathname } from 'next/navigation'

interface CartItem {
  product: {
    _id: string;
    name: string;
    mainImage: string;
    price: number;
    salePrice?: number;
  };
  size: string;
  quantity: number;
}

interface SidebarProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ cartItems, isOpen, onClose, onRemoveItem, onUpdateQuantity }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { handleCheckout } = useCheckout();
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname])

  const processCheckout = async () => {
    setIsLoading(true);
    await handleCheckout();
    setIsLoading(false);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: isOpen ? 0 : '100%' }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-screen max-w-md bg-white shadow-xl"
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart!</p>
                    <div className="mt-6">
                      <Button onClick={onClose} variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item, index) => (
                        <li key={`${item.product._id}-${item.size}`} className="py-6 flex">
                          <Link
                            href={`/product/${item.product._id}`}
                            className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden"
                            onClick={(e) => {
                              e.stopPropagation()
                              onClose()
                            }}
                          >
                            <Image
                              src={`/uploads/${item.product.mainImage}`}
                              alt={item.product.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-center object-cover"
                            />
                          </Link>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <Link
                                    href={`/product/${item.product._id}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onClose()
                                    }}
                                    className="hover:underline"
                                  >
                                    {item.product.name}
                                  </Link>
                                </h3>
                                <p className="ml-4">
                                  ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => onUpdateQuantity(index, Math.max(1, parseInt(e.target.value) || 1))}
                                  onClick={(e) => e.currentTarget.select()}
                                  className="w-16 p-1 text-center border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                              <div className="flex">
                                <button
                                  onClick={() => onRemoveItem(index)}
                                  className="text-sm font-medium text-black hover:text-gray-700 relative group"
                                >
                                  Remove
                                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transform origin-left transition-transform duration-300 ease-out group-hover:scale-x-0"></span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>
                    ${cartItems.reduce((total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 0).toFixed(2)}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6 space-y-4">
                  <Button onClick={processCheckout} disabled={isLoading} className="w-full bg-black text-white hover:bg-gray-800">
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </Button>
                  <Button onClick={onClose} variant="outline" className="w-full border-black text-black hover:bg-gray-100">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Sidebar

