// 小分類（中分類の下の細かい分類。中分類ページでチェックボックス絞り込みに使う）
export type SubSubCategory = {
  handle: string;
  title: string;
  tags: string[]; // この小分類に該当する商品タグ
};

// 中分類（サブカテゴリ）
export type SubCategory = {
  handle: string;  // URL: /collections/[大分類]/[中分類]
  title: string;   // 表示名
  tags: string[];  // この中分類に該当する商品タグ（どれか1つでも一致＝OR検索）
  subSubcategories?: SubSubCategory[]; // 小分類
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
      { handle: 'snowboard-board', title: 'スノーボード', tags: ['Snowboard', 'スノーボード'], subSubcategories: [
        { handle: 'board', title: 'ボード', tags: ['Board'] },
        { handle: 'binding', title: 'ビンディング', tags: ['Binding'] },
        { handle: 'wear', title: 'ウェア', tags: ['Wear'] },
        { handle: 'acc', title: '小物', tags: ['Snow-Acc'] },
      ] },
      { handle: 'ski', title: 'スキー', tags: ['Ski', 'スキー'], subSubcategories: [
        { handle: 'board', title: 'ボード', tags: ['Ski-Board'] },
        { handle: 'boots', title: 'ブーツ', tags: ['Boots'] },
        { handle: 'wear', title: 'ウェア', tags: ['Wear'] },
        { handle: 'acc', title: '小物', tags: ['Ski-Acc'] },
      ] },
    ],
  },
  {
    handle: 'summer',
    title: 'サマースポーツ',
    tags: ['Summer', '夏', 'Surf', 'サーフ', 'Swim', '水着','water', 'ウォーター'],
    description: '夏のアクティビティを全力で楽しむためのギア全コレクション',
    subcategories: [
      { handle: 'surf', title: 'サーフィン', tags: ['Surf', 'サーフ'], subSubcategories: [
        { handle: 'board', title: 'ボード', tags: ['Surfboard'] },
        { handle: 'wetsuit', title: 'ウェットスーツ', tags: ['Wetsuit'] },
        { handle: 'acc', title: '小物', tags: ['Surf-Acc'] },
      ] },
      { handle: 'sup', title: 'SUP', tags: ['SUP'], subSubcategories: [
        { handle: 'board', title: 'ボード', tags: ['SUP-Board'] },
        { handle: 'paddle', title: 'パドル', tags: ['Paddle'] },
        { handle: 'acc', title: '小物', tags: ['SUP-Acc'] },
      ] },
      { handle: 'snorkel', title: 'シュノーケル', tags: ['Snorkel', 'シュノーケル'], subSubcategories: [
        { handle: 'mask', title: 'マスク', tags: ['Mask'] },
        { handle: 'fin', title: 'フィン', tags: ['Fin'] },
        { handle: 'set', title: 'セット', tags: ['Snorkel-Set'] },
      ] },
      { handle: 'kayak', title: 'カヤック', tags: ['Kayak', 'カヤック'], subSubcategories: [
        { handle: 'body', title: '本体', tags: ['Kayak-Body'] },
        { handle: 'paddle', title: 'パドル', tags: ['Paddle'] },
        { handle: 'acc', title: '小物', tags: ['Kayak-Acc'] },
      ] },
      { handle: 'skate', title: 'スケート', tags: ['Skate', 'Skateboard', 'スケート'], subSubcategories: [
        { handle: 'deck', title: 'デッキ', tags: ['Deck'] },
        { handle: 'wheel', title: 'ウィール', tags: ['Wheel'] },
        { handle: 'acc', title: '小物', tags: ['Skate-Acc'] },
      ] },
    ],
  },
  {
    handle: 'ball-sports',
    title: 'ボールスポーツ',
    tags: ['Ball', 'ボール', '球技'],
    description: 'サッカー・バスケ・テニスなどボールスポーツ用品',
    subcategories: [
      { handle: 'tennis', title: 'テニス', tags: ['Tennis', 'テニス'], subSubcategories: [
        { handle: 'racket', title: 'ラケット', tags: ['Racket'] },
        { handle: 'ball', title: 'ボール', tags: ['Tennis-Ball'] },
        { handle: 'shoes', title: 'シューズ', tags: ['Shoes'] },
      ] },
      { handle: 'volleyball', title: 'バレー', tags: ['Volleyball', 'バレー'], subSubcategories: [
        { handle: 'ball', title: 'ボール', tags: ['Volleyball-Ball'] },
        { handle: 'shoes', title: 'シューズ', tags: ['Shoes'] },
        { handle: 'wear', title: 'ウェア', tags: ['Wear'] },
      ] },
      { handle: 'baseball', title: '野球', tags: ['Baseball', '野球'], subSubcategories: [
        { handle: 'bat', title: 'バット', tags: ['Bat'] },
        { handle: 'glove', title: 'グローブ', tags: ['Glove'] },
        { handle: 'ball', title: 'ボール', tags: ['Baseball-Ball'] },
      ] },
      { handle: 'basketball', title: 'バスケットボール', tags: ['Basketball', 'バスケットボール'], subSubcategories: [
        { handle: 'ball', title: 'ボール', tags: ['Basketball-Ball'] },
        { handle: 'shoes', title: 'シューズ', tags: ['Shoes'] },
        { handle: 'wear', title: 'ウェア', tags: ['Wear'] },
      ] },
      { handle: 'soccer', title: 'サッカー', tags: ['Soccer', 'サッカー'], subSubcategories: [
        { handle: 'ball', title: 'ボール', tags: ['Soccer-Ball'] },
        { handle: 'shoes', title: 'シューズ', tags: ['Shoes'] },
        { handle: 'wear', title: 'ウェア', tags: ['Wear'] },
      ] },
    ],
  },
  {
    handle: 'outdoor',
    title: 'アウトドア',
    tags: ['Outdoor','アウトドア', 'Camping', 'キャンプ', 'Hiking', 'ハイキング', 'Climbing', 'クライミング', 'Trekking', 'トレッキング'],
    description: '登山・キャンプ・トレッキングに最適なアウトドアギア',
    subcategories: [
      { handle: 'camping', title: 'キャンプ', tags: ['Camping', 'キャンプ'], subSubcategories: [
        { handle: 'tent', title: 'テント', tags: ['Tent'] },
        { handle: 'sleeping', title: '寝具', tags: ['Sleeping'] },
        { handle: 'cooking', title: '調理', tags: ['Cooking'] },
      ] },
      { handle: 'hiking', title: '登山・トレッキング', tags: ['Hiking', 'ハイキング', 'Trekking', 'トレッキング', 'Climbing', 'クライミング'], subSubcategories: [
        { handle: 'pole', title: 'ポール', tags: ['Pole'] },
        { handle: 'backpack', title: 'バックパック', tags: ['Backpack'] },
        { handle: 'wear', title: 'ウェア', tags: ['Wear'] },
      ] },
      { handle: 'bike', title: '自転車', tags: ['Bike', '自転車'], subSubcategories: [
        { handle: 'body', title: '本体', tags: ['Bike-Body'] },
        { handle: 'parts', title: 'パーツ', tags: ['Bike-Parts'] },
        { handle: 'acc', title: 'アクセサリー', tags: ['Bike-Acc'] },
      ] },
    ],
  },
];

export function getCollectionByHandle(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}
