// 特集（テーマ別の商品まとめ）。
// 大分類コレクションとは別軸で、季節やシーンなど「テーマ」で商品を横断的に集めるための仕組み。
// 飛び先は特集商品ページ /features/[handle]。
//
// kind:
//   'tag'    … tags に一致する商品をOR検索で表示（コレクションと同じ仕組み）
//   'newest' … タグに関係なく、新しく追加された商品を新着順で表示
//
// ※ tags は商品タグと完全一致（ダブルクォートでOR検索）。タグはユーザー管理。

export type Feature = {
  handle: string;   // URL: /features/[handle]
  title: string;    // 表示名
  subtitle: string; // カードに出す一言
  kind: 'tag' | 'newest';
  tags: string[];   // kind='tag' のときに使う商品タグ（OR検索）。'newest' のときは空でよい
};

export const FEATURES: Feature[] = [
  {
    handle: 'summer-water',
    title: '夏のウォーターアクティビティ',
    subtitle: 'サーフ・SUP・シュノーケルで海を満喫',
    kind: 'tag',
    // 既存のサマー系タグを流用（サーフ/SUP/シュノーケル/カヤック/水着など）
    tags: ['Surf', 'サーフ', 'SUP', 'Snorkel', 'シュノーケル', 'Kayak', 'カヤック', 'Swim', '水着', 'water', 'ウォーター'],
  },
  {
    handle: 'new-arrivals',
    title: '新着アイテム',
    subtitle: '入荷したばかりの注目ギア',
    kind: 'newest',
    tags: [],
  },
];

export function getFeatureByHandle(handle: string): Feature | undefined {
  return FEATURES.find((f) => f.handle === handle);
}
