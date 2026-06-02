import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

type Props = {
  title?: string;
  products: Product[];
};

export default function ProductGridSection({ title = '商品一覧', products }: Props) {
  return (
    <section id="products" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">商品が見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
