import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

// トップの「カテゴリから探す」。
// Heroが大分類の写真バナーを担当するので、ここは一段細かい「中分類」をテキストタイルで一覧する。
// 中分類には専用画像が無い（同じ親画像が並ぶと不自然）ため、写真ではなく整ったテキストタイルにしている。
// リンク先は中分類ページ /collections/[大分類]/[中分類]。
export default function CategoryTiles() {
  // 全大分類の中分類を平坦化し、親（大分類）の情報を添える
  const subcategories = COLLECTIONS.flatMap((collection) =>
    collection.subcategories.map((sub) => ({
      key: `${collection.handle}-${sub.handle}`,
      parentTitle: collection.title,
      title: sub.title,
      href: `/collections/${collection.handle}/${sub.handle}`,
    }))
  );

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
      <h2 className="text-xl font-bold text-gray-900 mb-5">カテゴリから探す</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {subcategories.map((sub) => (
          <Link
            key={sub.key}
            href={sub.href}
            className="group flex flex-col justify-center rounded-xl border border-gray-200 bg-white px-4 py-4 transition-colors hover:border-gray-900 hover:bg-gray-900"
          >
            <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
              {sub.parentTitle}
            </span>
            <span className="mt-0.5 text-sm sm:text-base font-bold text-gray-900 group-hover:text-white transition-colors">
              {sub.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
