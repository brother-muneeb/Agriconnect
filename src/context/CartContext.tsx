import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

import { useProducts } from './ProductContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (id: number, weight: string) => void;
  updateQuantity: (id: number, weight: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartSidebarOpen: boolean;
  setIsCartSidebarOpen: (isOpen: boolean) => void;
  getCurrentPriceData: (productName: string, fallbackPrice: number) => { originalPrice: number, discount: number, finalPrice: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { allProducts } = useProducts();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('agriconnect_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('agriconnect_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const getCurrentPriceData = (productName: string, fallbackPrice: number) => {
    const data = JSON.parse(localStorage.getItem('AgriConnectData') || '{}');
    const productData = data[productName];
    
    if (!productData) {
      return { originalPrice: fallbackPrice, discount: 0, finalPrice: fallbackPrice };
    }
    
    let rate = productData.rate;
    let discount = productData.discount || 0;
    
    if (productData.timerEnd) {
      const now = new Date().getTime();
      const end = new Date(productData.timerEnd).getTime();
      if (now > end) {
        productData.discount = 0;
        discount = 0;
        data[productName] = productData;
        localStorage.setItem('AgriConnectData', JSON.stringify(data));
      }
    }
    
    if (discount > 0) {
      const discountedPrice = rate - (rate * discount / 100);
      return { originalPrice: rate, discount, finalPrice: Math.round(discountedPrice) };
    } else {
      return { originalPrice: rate, discount: 0, finalPrice: rate };
    }
  };

  const addToCart = (product: Product, quantity: number, weight: string) => {
    const priceData = getCurrentPriceData(product.name, product.price);
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedWeight === weight);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedWeight === weight)
            ? { ...item, ...priceData, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, ...priceData, quantity, selectedWeight: weight }];
    });
    setIsCartSidebarOpen(true);
  };

  const removeFromCart = (id: number, weight: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedWeight === weight)));
  };

  const updateQuantity = (id: number, weight: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedWeight === weight) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getMultiplier = (weight: string) => {
    if (weight.includes('kg')) return parseFloat(weight);
    if (weight.includes('g')) return parseFloat(weight) / 1000;
    if (weight.includes('dozen')) return 1;
    return 1;
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total using current prices and discounts from AgriConnectData (Real Time Sync)
  const cartTotal = cartItems.reduce((sum, item) => {
    const priceData = getCurrentPriceData(item.name, item.price);
    return sum + (priceData.finalPrice * item.quantity * getMultiplier(item.selectedWeight));
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartSidebarOpen,
      setIsCartSidebarOpen,
      getCurrentPriceData
    }}>
      {children}
    </CartContext.Provider>
  );
};
