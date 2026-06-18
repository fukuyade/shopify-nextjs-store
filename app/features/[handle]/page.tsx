import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFeatureByHandle } from '@/lib/features';
import { getProductsByTag, getNewestProducts } from '@/lib/shopify';
import ProductCard from '@/components/ui/ProductCard';

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function FeaturePage({ params }: Props) {
  const { handle } = await params;
  const feature = getFeatureByHandle(handle);

  if (!feature) notFound();

  // 種別ごとに商品を取得（新着＝作成日順 / それ以外＝タグでOR検索）
  const products =
    feature.kind === 'newest'
      ? await getNewestProducts(24)
      : await getProductsByTag(feature.tags, 48);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* ヘッダー */}
      <div className="mb-10">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← トップへ
        </Link>
        <div className="mt-4">
          <span className="inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
            特集
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{feature.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{feature.subtitle}</p>
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
          <p className="text-lg">現在この商品はありません</p>
        </div>
      )}
    </section>
  );
}
