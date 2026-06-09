import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types';

type Props = {
  query: string;
  products: Product[];
};

export default function SearchResultsSection({ query, products }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          「{query}」の検索結果
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {products.length > 0
            ? `${products.length}件の商品が見つかりました`
            : '該当する商品が見つかりませんでした'}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-lg">別のキーワードで試してみてください</p>
        </div>
      )}
    </section>
  );
}
