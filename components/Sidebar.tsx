import React, { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

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
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onCheckout: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = () => {
    setIsLoading(true)
    onCheckout().finally(() => setIsLoading(false))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
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
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item, index) => (
                        <li key={`${item.product._id}-${item.size}`} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <Image
                              src={`/uploads/${item.product.mainImage}`}
                              alt={item.product.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">
                                  ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}>
                                  <Minus size={16} />
                                </Button>
                                <span className="mx-2">{item.quantity}</span>
                                <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(index, item.quantity + 1)}>
                                  <Plus size={16} />
                                </Button>
                              </div>
                              <div className="flex">
                                <Button variant="ghost" onClick={() => onRemoveItem(index)}>Remove</Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>
                    ${cartItems.reduce((total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 0).toFixed(2)}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Button onClick={handleCheckout} disabled={isLoading || cartItems.length === 0} className="w-full">
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-medium hover:text-indigo-500"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

