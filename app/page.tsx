import { getProducts } from '@/lib/shopify';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedSection from '@/components/sections/FeaturedSection';
import ProductGridSection from '@/components/sections/ProductGridSection';

export default async function Home() {
  const products = await getProducts(12);

  // 先頭4件をおすすめとして使う
  const featured = products.slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedSection title="おすすめ商品" products={featured} />
      <ProductGridSection title="すべての商品" products={products} />
    </>
  );
}
