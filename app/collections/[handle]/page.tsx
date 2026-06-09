import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCollectionByHandle } from '@/lib/collections';
import { getProductsByTag } from '@/lib/shopify';
import ProductCard from '@/components/ui/ProductCard';

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = getCollectionByHandle(handle);

  if (!collection) notFound();

  const products = await getProductsByTag(collection.tag);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* ヘッダー */}
      <div className="mb-10">
        <Link
          href="/collections"
          className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← コレクション一覧
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-4xl">{collection.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{collection.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{collection.description}</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-4">{products.length}件の商品</p>
      </div>

      {/* 商品グリッド */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-6xl mb-4">{collection.emoji}</p>
          <p className="text-lg">現在この商品はありません</p>
        </div>
      )}
    </section>
  );
}
