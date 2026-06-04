'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Cart } from '@/types';
import { createCart, addToCart } from '@/lib/shopify';

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function addItem(variantId: string, quantity = 1) {
    setIsLoading(true);
    try {
      if (cart) {
        // カートが既にある → 商品を追加
        const updated = await addToCart(cart.id, variantId, quantity);
        setCart(updated);
      } else {
        // カートがまだない → 新規作成
        const newCart = await createCart(variantId, quantity);
        setCart(newCart);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

// useCart フック（コンポーネントからカートを操作するために使う）
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart は CartProvider の中で使ってください');
  }
  return context;
}
