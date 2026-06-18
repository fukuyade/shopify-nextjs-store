import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import FavoriteButton from '@/components/ui/FavoriteButton';

type Props = {
  product: Product;
};

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
      <div className="rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
        {/* 商品画像 */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-4xl">
              📦
            </div>
          )}
          {/* お気に入りハート（画像右上） */}
          <FavoriteButton
            className="absolute top-2 right-2 z-10"
            item={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              image: image?.url ?? null,
              amount: price.amount,
              currencyCode: price.currencyCode,
            }}
          />
        </div>

        {/* 商品情報 */}
        <div className="p-3 sm:p-4">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
            {product.title}
          </h2>
          <p className="mt-1.5 font-bold text-gray-900 text-sm sm:text-base">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
        </div>
      </div>
    </Link>
  );
}
