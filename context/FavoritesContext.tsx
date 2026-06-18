'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// お気に入り（ウィッシュリスト）。ログイン不要で、ブラウザのlocalStorageに保存する。
// カート（CartContext）と同じく、端末内に保存する方式。

// 保存する最小限の商品情報（一覧表示に必要な分だけ）
export type FavoriteItem = {
  id: string;
  handle: string;
  title: string;
  image: string | null; // 画像URL
  amount: string;        // 価格
  currencyCode: string;
};

type FavoritesContextType = {
  items: FavoriteItem[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = 'favorite_items';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  // 初回マウント時にlocalStorageから復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // 壊れたデータは無視
    }
  }, []);

  // 変更のたびにlocalStorageへ保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 保存失敗は無視
    }
  }, [items]);

  function isFavorite(id: string): boolean {
    return items.some((it) => it.id === id);
  }

  // 入っていれば外す・無ければ追加
  function toggle(item: FavoriteItem) {
    setItems((prev) =>
      prev.some((it) => it.id === item.id)
        ? prev.filter((it) => it.id !== item.id)
        : [item, ...prev]
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <FavoritesContext.Provider value={{ items, count: items.length, isFavorite, toggle, remove }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites は FavoritesProvider の中で使ってください');
  }
  return context;
}
