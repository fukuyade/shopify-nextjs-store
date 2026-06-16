export type Collection = {
  handle: string;  // URLに使う識別子
  title: string;   // 表示名
  tags: string[];  // Shopify商品タグ（このうちどれか1つでも付いていれば表示＝OR検索）
  description: string;
};

export const COLLECTIONS: Collection[] = [
  {
    handle: 'snowboard',
    title: 'ウィンタースポーツ',
    tags: ['Winter','冬', 'Snowboard', 'スノーボード'],
    description: 'スノーボードをはじめ、冬のアクティビティを楽しむギア全コレクション',
  },
  {
    handle: 'summer',
    title: 'サマースポーツ',
    tags: ['Summer', '夏', 'Surf', 'サーフ', 'Swim', '水着','water', 'ウォーター'],
    description: '夏のアクティビティを全力で楽しむためのギア全コレクション',
  },
  {
    handle: 'ball-sports',
    title: 'ボールスポーツ',
    tags: ['Ball', 'ボール', '球技'],
    description: 'サッカー・バスケ・テニスなどボールスポーツ用品',
    
  },
  {
    handle: 'outdoor',
    title: 'アウトドア',
    tags: ['Outdoor','アウトドア', 'Camping', 'キャンプ', 'Hiking', 'ハイキング', 'Climbing', 'クライミング', 'Trekking', 'トレッキング'],
    description: '登山・キャンプ・トレッキングに最適なアウトドアギア',
  },
];

export function getCollectionByHandle(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}
