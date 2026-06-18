import Link from 'next/link';
import { FEATURES } from '@/lib/features';

// トップの「特集」セクション。テーマ別の小さめカードを並べ、各特集商品ページ /features/[handle] へ。
// 画像ではなくタイトル＋一言のテキストカードで、カテゴリ導線（Hero/メガメニュー）と役割を分けている。
export default function FeatureCards() {
  if (FEATURES.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
      <h2 className="text-xl font-bold text-gray-900 mb-5">特集</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map((feature) => (
          <Link
            key={feature.handle}
            href={`/features/${feature.handle}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-5 transition-colors hover:border-gray-900 hover:bg-gray-900"
          >
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 group-hover:bg-white/20 group-hover:text-white transition-colors">
                特集
              </span>
              <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 group-hover:text-gray-300 transition-colors line-clamp-1">
                {feature.subtitle}
              </p>
            </div>
            <span
              aria-hidden
              className="shrink-0 text-gray-300 group-hover:text-white group-hover:translate-x-0.5 transition-all"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
