import { notFound } from 'next/navigation';
import { getFeatureByHandle } from '@/lib/features';
import { getProductsByTag, getNewestProducts } from '@/lib/shopify';
import ProductCard from '@/components/ui/ProductCard';
import FeatureBlocks, { ResolvedBlock } from '@/components/sections/FeatureBlocks';

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function FeaturePage({ params }: Props) {
  const { handle } = await params;
  const feature = getFeatureByHandle(handle);

  if (!feature) notFound();

  // 1) blocks がある特集 … ブロックを上から描画（作り込み型）
  //    'products' ブロックだけサーバー側で商品を取得して埋め込む。
  if (feature.blocks && feature.blocks.length > 0) {
    const resolved: ResolvedBlock[] = await Promise.all(
      feature.blocks.map(async (block): Promise<ResolvedBlock> => {
        if (block.type === 'products') {
          const products =
            block.source === 'newest'
              ? await getNewestProducts(block.limit ?? 12)
              : await getProductsByTag(block.tags ?? [], block.limit ?? 12);
          return { ...block, products };
        }
        return block;
      })
    );

    return (
      <section className="max-w-5xl mx-auto px-4 py-12">
        <FeatureBlocks blocks={resolved} />
      </section>
    );
  }

  // 2) blocks が無い特集 … 従来どおりの商品一覧（デフォルト）
  const products =
    feature.kind === 'newest'
      ? await getNewestProducts(24)
      : await getProductsByTag(feature.tags, 48);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div>
          <span className="inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
            特集
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{feature.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{feature.subtitle}</p>
        </div>
        <p className="text-sm text-gray-400 mt-4">{products.length}件の商品</p>
      </div>

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
