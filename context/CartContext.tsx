'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '@/types';
import { createCart, addToCart, getCart, updateCartLine, removeCartLine } from '@/lib/shopify';

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (!savedCartId) return;

    getCart(savedCartId).then((restored) => {
      if (restored) {
        setCart(restored);
      } else {
        localStorage.removeItem(CART_ID_KEY);
      }
    });
  }, []);

  async function addItem(variantId: string, quantity = 1) {
    setIsLoading(true);
    try {
      if (cart) {
        const updated = await addToCart(cart.id, variantId, quantity);
        setCart(updated);
      } else {
        const newCart = await createCart(variantId, quantity);
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 個数変更
  async function updateItem(lineId: string, quantity: number) {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updated = await updateCartLine(cart.id, lineId, quantity);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  }

  // 商品削除
  async function removeItem(lineId: string) {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updated = await removeCartLine(cart.id, lineId);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart は CartProvider の中で使ってください');
  }
  return context;
}
