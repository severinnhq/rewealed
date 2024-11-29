import { useState, useEffect, useCallback } from 'react'

interface Product {
  _id: string
  name: string
  price: number
  salePrice?: number
  mainImage: string
}

interface CartItem {
  product: Product
  size: string
  quantity: number
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems')
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback((product: Product, size: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(
        item => item.product._id === product._id && item.size === size
      );
      if (existingItemIndex > -1) {
        return prev.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, size, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, newQuantity: number) => {
    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index].quantity = newQuantity;
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart };
}

