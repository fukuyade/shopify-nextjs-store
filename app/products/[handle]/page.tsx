import { notFound } from 'next/navigation';
import { getProductByHandle } from '@/lib/shopify';
import ProductDetailSection from '@/components/sections/ProductDetailSection';

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductDetailSection product={product} />;
}
