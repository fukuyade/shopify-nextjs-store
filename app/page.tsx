import { getProducts, getProductsByTag } from '@/lib/shopify';
import { COLLECTIONS } from '@/lib/collections';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedSection from '@/components/sections/FeaturedSection';

export default async function Home() {
  // おすすめ商品：Shopifyで「Featured」または「おすすめ」タグを付けた商品を表示。
  // タグ付き商品が無ければ、先頭4件をおすすめにする。
  const baseProducts = await getProducts(8);
  const featuredByTag = await getProductsByTag(['Featured', 'おすすめ'], 12);
  const featured = featuredByTag.length > 0 ? featuredByTag : baseProducts.slice(0, 4);

  // コレクションごとの商品（横スライドで表示）
  const collectionRows = await Promise.all(
    COLLECTIONS.map(async (collection) => ({
      collection,
      products: await getProductsByTag(collection.tags, 12),
    }))
  );

  return (
    <>
      <HeroSection />
      <FeaturedSection title="おすすめ商品" products={featured} />

      {/* コレクションごとに横スライドで表示 */}
      {collectionRows.map(({ collection, products }) => (
        <FeaturedSection key={collection.handle} title={collection.title} products={products} />
      ))}
    </>
  );
}
