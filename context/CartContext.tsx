'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '@/types';
import { createCart, addToCart, getCart } from '@/lib/shopify';

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 起動時に localStorage からカートIDを復元
  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (!savedCartId) return;

    // 保存されたIDでShopifyからカート情報を取得
    getCart(savedCartId).then((restored) => {
      if (restored) {
        setCart(restored);
      } else {
        // カートが期限切れなどで取得できない場合は削除
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
        // カートIDを localStorage に保存
        localStorage.setItem(CART_ID_KEY, newCart.id);
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart は CartProvider の中で使ってください');
  }
  return context;
}
