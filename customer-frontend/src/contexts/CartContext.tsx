// src/contexts/CartContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, SelectedOption } from '@/types';

const CART_STORAGE_KEY = 'table_order_cart';

interface AddCartItemInput {
  menuId: number;
  menuName: string;
  menuImage: string | null;
  basePrice: number;
  quantity: number;
  selectedOptions: SelectedOption[];
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const calculateItemTotal = (basePrice: number, quantity: number, options: SelectedOption[]) => {
    const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
    return (basePrice + optionsTotal) * quantity;
  };

  const addItem = (input: AddCartItemInput) => {
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      ...input,
      itemTotal: calculateItemTotal(input.basePrice, input.quantity, input.selectedOptions),
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (itemId: string) => setItems(prev => prev.filter(item => item.id !== itemId));

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(itemId); return; }
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity, itemTotal: calculateItemTotal(item.basePrice, quantity, item.selectedOptions) }
        : item
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalAmount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
