// 中分類（サブカテゴリ）
export type SubCategory = {
  handle: string;  // URL: /collections/[大分類]/[中分類]
  title: string;   // 表示名
  tags: string[];  // この中分類に該当する商品タグ（どれか1つでも一致＝OR検索）
};

// 大分類（コレクション）
export type Collection = {
  handle: string;  // URLに使う識別子
  title: string;   // 表示名
  tags: string[];  // Shopify商品タグ（このうちどれか1つでも付いていれば表示＝OR検索）
  description: string;
  subcategories: SubCategory[]; // 中分類
};

export const COLLECTIONS: Collection[] = [
  {
    handle: 'snowboard',
    title: 'ウィンタースポーツ',
    tags: ['Winter','冬', 'Snowboard', 'スノーボード'],
    description: 'スノーボードをはじめ、冬のアクティビティを楽しむギア全コレクション',
    subcategories: [
      { handle: 'snowboard-board', title: 'スノーボード', tags: ['Snowboard', 'スノーボード'] },
      { handle: 'ski', title: 'スキー', tags: ['Ski', 'スキー'] },
    ],
  },
  {
    handle: 'summer',
    title: 'サマースポーツ',
    tags: ['Summer', '夏', 'Surf', 'サーフ', 'Swim', '水着','water', 'ウォーター'],
    description: '夏のアクティビティを全力で楽しむためのギア全コレクション',
    subcategories: [
      { handle: 'surf', title: 'サーフィン', tags: ['Surf', 'サーフ'] },
      { handle: 'sup', title: 'SUP', tags: ['SUP'] },
      { handle: 'snorkel', title: 'シュノーケル', tags: ['Snorkel', 'シュノーケル'] },
      { handle: 'kayak', title: 'カヤック', tags: ['Kayak', 'カヤック'] },
      { handle: 'skate', title: 'スケート', tags: ['Skate', 'Skateboard', 'スケート'] },
    ],
  },
  {
    handle: 'ball-sports',
    title: 'ボールスポーツ',
    tags: ['Ball', 'ボール', '球技'],
    description: 'サッカー・バスケ・テニスなどボールスポーツ用品',
    subcategories: [
      { handle: 'tennis', title: 'テニス', tags: ['Tennis', 'テニス'] },
      { handle: 'volleyball', title: 'バレー', tags: ['Volleyball', 'バレー'] },
      { handle: 'baseball', title: '野球', tags: ['Baseball', '野球'] },
      { handle: 'basketball', title: 'バスケットボール', tags: ['Basketball', 'バスケットボール'] },
      { handle: 'soccer', title: 'サッカー', tags: ['Soccer', 'サッカー'] },
    ],
  },
  {
    handle: 'outdoor',
    title: 'アウトドア',
    tags: ['Outdoor','アウトドア', 'Camping', 'キャンプ', 'Hiking', 'ハイキング', 'Climbing', 'クライミング', 'Trekking', 'トレッキング'],
    description: '登山・キャンプ・トレッキングに最適なアウトドアギア',
    subcategories: [
      { handle: 'camping', title: 'キャンプ', tags: ['Camping', 'キャンプ'] },
      { handle: 'hiking', title: '登山・トレッキング', tags: ['Hiking', 'ハイキング', 'Trekking', 'トレッキング', 'Climbing', 'クライミング'] },
      { handle: 'bike', title: '自転車', tags: ['Bike', '自転車'] },
    ],
  },
];

export function getCollectionByHandle(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}
