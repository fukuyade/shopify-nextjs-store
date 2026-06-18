// 特集（テーマ別の商品まとめ）。
// 大分類コレクションとは別軸で、季節やシーンなど「テーマ」で商品を横断的に集めるための仕組み。
// 飛び先は特集商品ページ /features/[handle]。
//
// kind:
//   'tag'    … tags に一致する商品をOR検索で表示（コレクションと同じ仕組み）
//   'newest' … タグに関係なく、新しく追加された商品を新着順で表示
//
// ▼ 運用メモ（ここを編集するだけで特集を管理できます）
//   - published: false にするとトップにも詳細ページにも出ない（公開ON/OFFの切り替え）。
//   - date: 投稿日（"YYYY-MM-DD"）。トップではこの日付が新しい順に並ぶ。
//   - image: 正方形(1:1)の画像を推奨。public/features/{handle}.jpg に置く。
//   - tags は商品タグと完全一致（ダブルクォートでOR検索）。タグはユーザー管理。

export type Feature = {
  handle: string;    // URL: /features/[handle]
  title: string;     // 表示名
  subtitle: string;  // カードに出す一言
  image: string;     // 正方形画像のパス（例: /features/summer-water.jpg）
  date: string;      // 投稿日 "YYYY-MM-DD"（新しい順に並べる）
  published: boolean;// 公開ON/OFF
  kind: 'tag' | 'newest';
  tags: string[];    // kind='tag' のときに使う商品タグ（OR検索）。'newest' のときは空でよい
};

export const FEATURES: Feature[] = [
  {
    handle: 'summer-water',
    title: '夏のウォーターアクティビティ',
    subtitle: 'サーフ・SUP・シュノーケルで海を満喫',
    image: '/features/summer-water.jpg',
    date: '2026-06-10',
    published: true,
    kind: 'tag',
    // 既存のサマー系タグを流用（サーフ/SUP/シュノーケル/カヤック/水着など）
    tags: ['Surf', 'サーフ', 'SUP', 'Snorkel', 'シュノーケル', 'Kayak', 'カヤック', 'Swim', '水着', 'water', 'ウォーター'],
  },
  {
    handle: 'new-arrivals',
    title: '新着アイテム',
    subtitle: '入荷したばかりの注目ギア',
    image: '/features/new-arrivals.jpg',
    date: '2026-06-18',
    published: true,
    kind: 'newest',
    tags: [],
  },
];

// 公開中の特集を新しい順（date降順）で返す。トップ・一覧で使用。
export function getPublishedFeatures(): Feature[] {
  return FEATURES.filter((f) => f.published).sort((a, b) => b.date.localeCompare(a.date));
}

// handleで特集を取得。published=false は返さない（詳細ページで404にするため）。
export function getFeatureByHandle(handle: string): Feature | undefined {
  return FEATURES.find((f) => f.handle === handle && f.published);
}
