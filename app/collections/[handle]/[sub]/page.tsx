import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCollectionByHandle } from '@/lib/collections';
import { getProductsByTag } from '@/lib/shopify';
import ProductCard from '@/components/ui/ProductCard';

type Props = {
  params: Promise<{ handle: string; sub: string }>;
};

export default async function SubCategoryPage({ params }: Props) {
  const { handle, sub } = await params;
  const collection = getCollectionByHandle(handle);
  if (!collection) notFound();

  const subcategory = collection.subcategories.find((s) => s.handle === sub);
  if (!subcategory) notFound();

  const products = await getProductsByTag(subcategory.tags);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* パンくず */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <Link href="/collections" className="hover:text-gray-900 transition-colors">
            コレクション一覧
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${collection.handle}`}
            className="hover:text-gray-900 transition-colors"
          >
            {collection.title}
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">{subcategory.title}</h1>
        <p className="text-sm text-gray-400 mt-2">{products.length}件の商品</p>
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
          <p className="text-lg">現在この商品はありません</p>
        </div>
      )}
    </section>
  );
}
