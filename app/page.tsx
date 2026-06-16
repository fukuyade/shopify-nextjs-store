import { getProducts, getProductsByTag } from '@/lib/shopify';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedSection from '@/components/sections/FeaturedSection';
import ProductGridSection from '@/components/sections/ProductGridSection';

export default async function Home() {
  const products = await getProducts(100);

  // おすすめ商品：Shopifyで「Featured」または「おすすめ」タグを付けた商品を表示。
  // タグ付き商品が無ければ、従来どおり先頭4件をおすすめにする。
  const featuredByTag = await getProductsByTag(['Featured', 'おすすめ'], 12);
  const featured = featuredByTag.length > 0 ? featuredByTag : products.slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedSection title="おすすめ商品" products={featured} />
      <ProductGridSection title="すべての商品" products={products} />
    </>
  );
}
