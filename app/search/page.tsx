import { searchProducts } from '@/lib/shopify';
import SearchResultsSection from '@/components/sections/SearchResultsSection';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const products = await searchProducts(q);

  return <SearchResultsSection query={q} products={products} />;
}
