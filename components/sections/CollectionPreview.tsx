import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

type Props = {
  title: string;
  href: string; // 「もっと見る」のリンク先（コレクションページ）
  products: Product[];
};

// コレクションごとの商品を小さめグリッド（PC5列・スマホ3列）で数行表示し、
// 「もっと見る」でそのコレクションページへ。
export default function CollectionPreview({ title, href, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link
          href={href}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
        >
          もっと見る →
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
