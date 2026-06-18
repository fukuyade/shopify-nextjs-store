import Link from 'next/link';
import Image from 'next/image';
import { getPublishedFeatures } from '@/lib/features';

// トップの「特集」セクション。
// 参考サイト風に「正方形の写真＋下にタイトル/一言」のカードを並べる。
// 並びは投稿日の新しい順。表示数はスマホ最大6件・PCは最大3件
//   （6件描画し、4件目以降を lg:hidden でPCのみ隠す）。
export default function FeatureCards() {
  const features = getPublishedFeatures().slice(0, 6);
  if (features.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
      <h2 className="text-xl font-bold text-gray-900 mb-5">特集</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-4">
        {features.map((feature, i) => (
          <Link
            key={feature.handle}
            href={`/features/${feature.handle}`}
            // 4件目以降（index>=3）はPC幅で非表示 → PC3件 / スマホ6件
            className={`group block ${i >= 3 ? 'lg:hidden' : ''}`}
          >
            {/* 正方形の写真 */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* 写真の下にタイトル＋一言 */}
            <h3 className="mt-3 text-base sm:text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
              {feature.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 line-clamp-2">
              {feature.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
