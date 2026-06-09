export type Collection = {
  handle: string;  // URLに使う識別子
  title: string;   // 表示名
  tag: string;     // Shopifyのタグ名
  description: string;
  emoji: string;
};

export const COLLECTIONS: Collection[] = [
  {
    handle: 'snowboard',
    title: 'スノーボード',
    tag: 'Winter',
    description: 'パウダーからパークまで対応するスノーボード全コレクション',
    emoji: '🏂',
  },
  {
    handle: 'summer',
    title: 'サマースポーツ',
    tag: 'Summer',
    description: '夏のアクティビティを全力で楽しむためのギア一覧',
    emoji: '☀️',
  },
  {
    handle: 'water',
    title: 'ウォータースポーツ',
    tag: 'Water',
    description: 'サーフィン・SUP・カヤックなど水上スポーツ用品',
    emoji: '🌊',
  },
  {
    handle: 'outdoor',
    title: 'アウトドア',
    tag: 'Outdoor',
    description: '登山・キャンプ・トレッキングに最適なアウトドアギア',
    emoji: '🏔️',
  },
];

export function getCollectionByHandle(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}
