import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

export default function CollectionsPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">コレクション</h1>
      <p className="text-gray-500 text-sm mb-10">カテゴリから商品を探す</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className="group block bg-gray-50 rounded-2xl p-8 hover:bg-gray-900 transition-colors duration-300"
          >
            <p className="text-5xl mb-4">{collection.emoji}</p>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors mb-2">
              {collection.title}
            </h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed">
              {collection.description}
            </p>
            <p className="mt-4 text-sm font-medium text-gray-900 group-hover:text-white transition-colors">
              見る →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
