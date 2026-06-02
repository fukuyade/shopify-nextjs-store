import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

type Props = {
  product: Product;
};

// 価格をフォーマットする関数
function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default function ProductCard({ product }: Props) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* 商品画像 */}
        <div className="relative aspect-square bg-gray-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* 商品情報 */}
        <div className="p-4">
          <h2 className="font-semibold text-gray-800 truncate">{product.title}</h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          <p className="mt-2 font-bold text-gray-900">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
        </div>
      </div>
    </Link>
  );
}
