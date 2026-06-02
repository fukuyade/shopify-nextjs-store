import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

type Props = {
  title?: string;
  products: Product[];
};

export default function FeaturedSection({ title = 'おすすめ商品', products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

        {/* 横スクロールカルーセル */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="min-w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
