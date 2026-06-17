'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { COLLECTIONS } from '@/lib/collections';

function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="商品を検索..."
          className="w-full pl-9 pr-8 py-1.5 text-sm border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="absolute left-2.5 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="検索"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); router.push('/'); }}
            className="absolute right-3 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="クリア"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

const NAV_LINKS = [
  { href: '/', label: '商品一覧' },
  { href: '/collections', label: 'コレクション' },
];

export default function Header() {
  const { cart } = useCart();
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const itemCount = cart?.totalQuantity ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">

        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors flex-shrink-0">
          MyStore
        </Link>

        {/* 検索フォーム（中央・PC） */}
        <div className="hidden sm:flex flex-1 justify-center max-w-sm mx-auto">
          <Suspense fallback={<div className="w-full h-8 bg-gray-100 rounded-full" />}>
            <SearchForm />
          </Suspense>
        </div>

        {/* 右側 */}
        <div className="ml-auto flex items-center gap-2">
          {/* PCナビ */}
          <nav className="hidden md:flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* カートアイコン */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* アカウントアイコン */}
          <Link
            href={isLoggedIn ? '/account' : '/login'}
            className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={isLoggedIn ? 'アカウント' : 'ログイン'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {isLoggedIn && (
              <span className="absolute top-1.5 right-1.5 bg-green-500 w-2 h-2 rounded-full ring-2 ring-white" />
            )}
          </Link>

          {/* ハンバーガーボタン（モバイルのみ） */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="メニュー"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* カテゴリバー（PC・大分類にホバーで中分類を表示） */}
      <div className="hidden md:block border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1">
          {COLLECTIONS.map((c) => (
            <div key={c.handle} className="relative group">
              <Link
                href={`/collections/${c.handle}`}
                className="inline-flex items-center px-3 py-2.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                {c.title}
              </Link>
              {/* 中分類ドロップダウン */}
              <div className="absolute left-0 top-full hidden group-hover:block pt-1 z-50">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px]">
                  {c.subcategories.map((sub) => (
                    <Link
                      key={sub.handle}
                      href={`/collections/${c.handle}/${sub.handle}`}
                      className="block px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          {/* モバイル検索 */}
          <Suspense fallback={<div className="w-full h-8 bg-gray-100 rounded-full" />}>
            <SearchForm />
          </Suspense>

          {/* モバイルナビ */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className={`px-2 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === '/account' || pathname === '/login'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isLoggedIn ? 'アカウント' : 'ログイン'}
            </Link>
          </nav>

          {/* カテゴリ（大分類→中分類） */}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {COLLECTIONS.map((c) => (
              <div key={c.handle}>
                <Link
                  href={`/collections/${c.handle}`}
                  className="block px-2 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
                >
                  {c.title}
                </Link>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pl-4 py-1">
                  {c.subcategories.map((sub) => (
                    <Link
                      key={sub.handle}
                      href={`/collections/${c.handle}/${sub.handle}`}
                      className="text-xs text-gray-500 hover:text-gray-900 py-0.5"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
