# 引き継ぎドキュメント
## Shopify × Next.js ストア学習プロジェクト

---

## プロジェクト概要

fukuさんがNext.js・Reactを学習するために構築しているShopifyストアフロント。
ポートフォリオ兼、将来的に実店舗でそのまま使えるレベルを目指している。

- **GitHub**: https://github.com/fukuyade/shopify-nextjs-store
- **Vercel（公開URL）**: デプロイ済み（Vercelダッシュボードで確認）
- **Shopifyストア**: fuku-dev-store.myshopify.com

---

## 技術スタック

- **フレームワーク**: Next.js 13+ App Router
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **API**: Shopify Storefront API（GraphQL）
- **状態管理**: React Context API（CartContext）
- **デプロイ**: Vercel
- **バージョン管理**: GitHub

---

## 環境変数（.env.local）

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=fuku-dev-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=f6668151e89bdb388630fdda20ba7572
```

---

## ファイル構成

```
app/
  layout.tsx                    # ルートレイアウト（CartProvider・Header・Footer）
  page.tsx                      # ホームページ
  cart/page.tsx                 # カートページ
  products/[handle]/page.tsx    # 商品詳細ページ
  collections/page.tsx          # コレクション一覧
  collections/[handle]/page.tsx # コレクション別商品一覧
  search/page.tsx               # 検索結果ページ

components/
  layout/
    Header.tsx    # 検索バー・ハンバーガーメニュー・カートアイコン
    Footer.tsx    # コレクションリンク・サポートリンク
  sections/
    HeroSection.tsx          # トップのヒーロー画像エリア
    FeaturedSection.tsx      # 横スクロールカルーセル
    ProductGridSection.tsx   # 商品グリッド一覧
    ProductDetailSection.tsx # 商品詳細（画像・バリアント・カート追加）
    CartSection.tsx          # カート内容（個数変更・削除・チェックアウト）
    SearchResultsSection.tsx # 検索結果表示
  ui/
    Button.tsx      # 共通ボタン（primary/secondary/outline）
    ProductCard.tsx # 商品カード

lib/
  shopify.ts      # Shopify Storefront API 通信（全GraphQL関数）
  collections.ts  # コレクション定義（handle・tag・説明）

context/
  CartContext.tsx  # カート状態管理（localStorage永続化）

types/
  index.ts  # TypeScript型定義
```

---

## lib/shopify.ts の主な関数

| 関数 | 用途 |
|---|---|
| `getProducts(count)` | 商品一覧取得 |
| `getProductByHandle(handle)` | 商品詳細取得 |
| `searchProducts(keyword)` | タイトル・タグで検索 |
| `getProductsByTag(tag)` | タグで絞り込み（コレクション用） |
| `createCart(variantId, quantity)` | カート新規作成 |
| `addToCart(cartId, variantId, quantity)` | カートに商品追加 |
| `getCart(cartId)` | カート復元（ページ更新後） |
| `updateCartLine(cartId, lineId, quantity)` | 個数変更 |
| `removeCartLine(cartId, lineId)` | 商品削除 |

---

## lib/collections.ts のコレクション定義

```typescript
{ handle: 'snowboard', tag: 'Winter',  title: 'スノーボード' }
{ handle: 'summer',    tag: 'Summer',  title: 'サマースポーツ' }
{ handle: 'water',     tag: 'Water',   title: 'ウォータースポーツ' }
{ handle: 'outdoor',   tag: 'Outdoor', title: 'アウトドア' }
```

**注意**: `tag` はShopify商品タグの英語名と一致させる必要がある。

---

## 実装済みの機能

- [x] 商品一覧ページ（ホーム）
- [x] 商品詳細ページ（バリアント選択・カート追加）
- [x] カートページ（個数変更・削除・チェックアウトリンク）
- [x] カート永続化（localStorage）
- [x] Headerカートバッジ（件数表示）
- [x] 検索機能（商品名・タグで絞り込み）
- [x] コレクションページ（カテゴリ別一覧）
- [x] レスポンシブ対応（ハンバーガーメニュー）
- [x] Vercelデプロイ（公開URL）

---

## Shopifyデータの状態

### 商品データ
- スノーボード商品：15点（日本語名・円価格設定済み）
- サマースポーツ商品：15点（日本語名・英語handle設定済み）
- 通貨：JPY
- 在庫：サマー商品は在庫0（Shopify Adminで設定要）

### handleについての注意
- スノーボード商品：英語タイトルで作成後に日本語化 → handleは英語のまま ✅
- サマー商品：日本語タイトルで作成 → handleを手動で英語に修正済み ✅
- **今後の商品追加時**：Shopify Admin「URLハンドル」欄で英語handleを手動設定すること

---

## 今後やりたいこと（本番化に向けて）

- [ ] Admin APIを使った商品管理機能（Next.js API Route + Admin APIトークン）
- [ ] ユーザー認証（Shopify Customer API）
- [ ] 注文履歴ページ
- [ ] お気に入り機能
- [ ] README.mdの作成（ポートフォリオ向け説明文）
- [ ] サマー商品の在庫設定
- [ ] 商品画像の追加（現在はサマー商品に画像なし）

---

## 学習スタイルの引き継ぎ

- **進め方**: 実装してから解説（コードを先に書いて後で説明）
- **Notionまとめ**: 各日の終わりにNotionにまとめる（1日目〜8日目まで作成済み）
- **GitHub**: 実装完了のタイミングでpush
- **コミットメッセージ形式**: `feat:` `fix:` `refactor:` `style:` `docs:` `chore:`
- **目標**: ポートフォリオとして提出できるレベル＋実店舗で使えるレベル

---

## Gitコマンド例

```bash
git add .
git commit -m "feat: 機能の説明"
git push origin main
```
