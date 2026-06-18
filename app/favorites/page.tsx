'use client';

import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

// お気に入り一覧。localStorageに保存した商品をグリッド表示する。
export default function FavoritesPage() {
  const { items } = useFavorites();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">お気に入り</h1>
      <p className="text-sm text-gray-500 mb-8">
        {items.length > 0 ? `${items.length}件のお気に入り` : '気になる商品をハートで保存できます。'}
      </p>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            // ProductCard で表示するために、保存している最小情報から Product 形に組み直す
            const product: Product = {
              id: item.id,
              handle: item.handle,
              title: item.title,
              description: '',
              priceRange: { minVariantPrice: { amount: item.amount, currencyCode: item.currencyCode } },
              images: item.image
                ? { edges: [{ node: { url: item.image, altText: item.title } }] }
                : { edges: [] },
            };
            return <ProductCard key={item.id} product={product} />;
          })}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">お気に入りはまだありません</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900"
          >
            商品を探す
          </Link>
        </div>
      )}
    </section>
  );
}
