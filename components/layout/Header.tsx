'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
          MyStore
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            商品一覧
          </Link>
          <Link href="/collections" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            コレクション
          </Link>
        </nav>

        {/* カートアイコン */}
        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* 件数バッジ */}
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
