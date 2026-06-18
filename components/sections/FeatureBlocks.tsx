import Image from 'next/image';
import { FeatureBlock } from '@/lib/features';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

// 'products' ブロックは、ページ側で商品を取得して products を付けた状態で渡す。
// （データ取得はサーバー、描画はこのコンポーネント、と役割を分けている）
export type ResolvedBlock =
  | Exclude<FeatureBlock, { type: 'products' }>
  | (Extract<FeatureBlock, { type: 'products' }> & { products: Product[] });

// 特集詳細ページのブロックを上から順に描画する表示用コンポーネント。
export default function FeatureBlocks({ blocks }: { blocks: ResolvedBlock[] }) {
  return (
    <div className="space-y-12">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'banner':
            return (
              <div
                key={i}
                className="relative w-full overflow-hidden rounded-xl bg-gray-100 aspect-[16/9] sm:aspect-[2.6/1]"
              >
                <Image
                  src={block.image}
                  alt={block.heading ?? ''}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
                {(block.heading || block.subtext) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                )}
                {(block.heading || block.subtext) && (
                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white ${
                      block.align === 'center' ? 'items-center text-center' : 'items-start'
                    }`}
                  >
                    {block.heading && (
                      <h2 className="text-xl sm:text-3xl font-bold drop-shadow-sm">{block.heading}</h2>
                    )}
                    {block.subtext && (
                      <p className="mt-1 text-sm sm:text-base text-gray-100 drop-shadow-sm max-w-2xl">
                        {block.subtext}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );

          case 'heading':
            return (
              <div key={i}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{block.text}</h2>
                {block.lead && <p className="mt-2 text-sm text-gray-500">{block.lead}</p>}
              </div>
            );

          case 'text':
            return (
              <div key={i} className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-700">
                {block.body.split('\n').map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            );

          case 'products':
            if (block.products.length === 0) return null;
            return (
              <div key={i}>
                {block.heading && (
                  <h2 className="mb-4 text-xl font-bold text-gray-900">{block.heading}</h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {block.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
