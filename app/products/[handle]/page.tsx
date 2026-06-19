import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/shopify';
import ProductDetailSection from '@/components/sections/ProductDetailSection';

type Props = {
  params: Promise<{ handle: string }>;
};

// ブラウザのタブ・SEO・SNS共有用のタイトル/説明を商品データから生成
export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: '商品が見つかりません' };
  return {
    title: product.title,
    description: product.description?.slice(0, 120) || `${product.title}の商品ページ`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductDetailSection product={product} />;
}
