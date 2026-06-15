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

# Customer Account API（新方式・OAuth2）
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=（Headlessチャネルで取得）
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET=（Headlessチャネルで取得）
SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI=https://<Vercel>.vercel.app/api/auth/callback
APP_BASE_URL=https://<Vercel>.vercel.app
```

**注意**: `SHOPIFY_CUSTOMER_ACCOUNT_*` と `APP_BASE_URL` はVercelのEnvironment Variablesにも同じ値を登録すること。`.env*` はgitignore済みなのでコミットされない。

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
  login/page.tsx                # ログイン入口（Shopifyホスト型ログインへ）
  register/page.tsx             # /login へリダイレクト（新規登録もShopify側で）
  account/page.tsx              # アカウント・注文履歴（サーバーComponent・要ログイン）
  account/profile/page.tsx      # 名前登録ページ（初回ログイン後に必須）
  api/account/profile/route.ts  # 名前を更新（customerUpdate）
  api/auth/login/route.ts       # 認可URLを生成しShopifyへリダイレクト
  api/auth/callback/route.ts    # code→トークン交換しCookie保存
  api/auth/logout/route.ts      # Cookie削除＋Shopifyセッション終了
  api/auth/refresh/route.ts     # リフレッシュトークンで再発行

components/
  layout/
    Header.tsx    # 検索バー・ハンバーガーメニュー・カート/アカウントアイコン
    Footer.tsx    # コレクションリンク・サポートリンク
  sections/
    HeroSection.tsx          # トップのヒーロー画像エリア
    FeaturedSection.tsx      # 横スクロールカルーセル
    ProductGridSection.tsx   # 商品グリッド一覧
    ProductDetailSection.tsx # 商品詳細（画像・バリアント・カート追加）
    CartSection.tsx          # カート内容（個数変更・削除・チェックアウト）
    SearchResultsSection.tsx # 検索結果表示
    AccountView.tsx          # アカウント情報・注文履歴・ログアウト（サーバーComponent）
    AccountSection.tsx       # 旧名。AccountView を再エクスポートするだけ
  ui/
    Button.tsx      # 共通ボタン（primary/secondary/outline）
    ProductCard.tsx # 商品カード

lib/
  shopify.ts          # Shopify Storefront API 通信（商品・カート）
  customer-account.ts # Customer Account API（OAuth2・トークン交換・顧客/注文取得）
  auth-cookies.ts     # 認証Cookieの名前・set/clearヘルパー
  collections.ts      # コレクション定義（handle・tag・説明）

context/
  CartContext.tsx  # カート状態管理（localStorage永続化）
  AuthContext.tsx  # ログイン表示状態のみ（読み取り可能Cookie cust_logged_in を参照）

types/
  index.ts  # TypeScript型定義
```

---

## lib/shopify.ts の主な関数（商品・カート）

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

## lib/customer-account.ts の主な関数（認証・Customer Account API）

| 関数 | 用途 |
|---|---|
| `buildAuthorizationUrl(state, nonce)` | Shopifyログインへの認可URL生成 |
| `exchangeCodeForToken(code)` | 認可コード→アクセストークン交換 |
| `refreshAccessToken(refreshToken)` | アクセストークン再発行 |
| `buildLogoutUrl(idToken)` | Shopifyセッション終了URL生成 |
| `getCustomerWithOrders(accessToken)` | 顧客情報＋注文履歴の取得（GraphQL） |
| `updateCustomerName(accessToken, firstName, lastName)` | 名前の保存（customerUpdate） |
| `setCustomerPhone(accessToken, phone)` | 電話番号を顧客メタフィールド custom.phone に保存（metafieldsSet） |

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
- [x] ユーザー認証（Customer Account API / OAuth2・Confidentialクライアント）
- [x] 注文履歴ページ（サーバーComponentでトークン取得・未ログインはログインへ）
- [x] httpOnly Cookieでトークン管理・自動リフレッシュ・Headerアカウントアイコン
- [x] 初回ログイン後の名前（姓・名）必須登録（customerUpdate）
- [x] 電話番号（任意）を顧客メタフィールド custom.phone に保存（metafieldsSet）
- [x] プロフィール編集ページ（/account/profile・後から名前/電話を編集可能）

※ Customer Account APIには電話番号の専用mutationが無い（CustomerUpdateInputは姓名のみ、CustomerPhoneNumberは読み取り専用）。
　 そのため公式の電話欄ではなく、顧客メタフィールド custom.phone として保存している。
　 注: ストアに custom.phone のメタフィールド定義（顧客リソース・顧客アクセスRead/Write）が必要な場合がある。

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

## ユーザー認証（新方式）の仕組みとセットアップ

ストアは新方式（`NEW_CUSTOMER_ACCOUNTS`）のため、Customer Account API（OAuth2）で実装。
メール＋パスワードのフォームは廃止し、Shopifyホスト型ログインへリダイレクトする方式。

### 認証フロー
1. `/login` → `/api/auth/login`：state/nonce発行・Cookie保存 → Shopifyログインへ
2. Shopifyで認証 → `/api/auth/callback?code=...`：state照合 → code→トークン交換 → httpOnly Cookie保存
3. `/account`（サーバーComponent）：Cookieのアクセストークンで Customer Account API を呼び注文取得
4. トークン失効時：`/api/auth/refresh` がリフレッシュトークンで再発行
5. `/api/auth/logout`：Cookie削除＋Shopifyの `end_session_endpoint` でセッション終了

### Shopify側セットアップ（これをやらないと動かない）
1. Shopify管理画面 → **Apps and sales channels → Shopify App Store** で **Headless** チャネルをインストール
2. Headlessチャネル → ストアフロントを作成 → **Customer Account API settings** を開く
3. クライアント種別を **Confidential** にし、**Client ID** と **Client secret** をコピー
4. Application setup に登録:
   - **Callback URL(s)**: `https://<Vercel>.vercel.app/api/auth/callback`
   - **JavaScript origins**: `https://<Vercel>.vercel.app`
   - **Logout URL**: `https://<Vercel>.vercel.app`
5. `.env.local` とVercelの環境変数に `SHOPIFY_CUSTOMER_ACCOUNT_*` と `APP_BASE_URL` を設定

### 制約・確認方法
- **localhostは不可**（Shopifyがリダイレクトに許可しない）。動作確認はVercelのデプロイ先で行う。
- 確認手順: デプロイ後 `/login` → 「ログイン/新規登録に進む」 → Shopify画面でメール認証 → `/account` に注文履歴（注文が無ければ空表示）。

---

## 今後やりたいこと（本番化に向けて）

- [ ] Admin APIを使った商品管理機能（Next.js API Route + Admin APIトークン）
- [ ] お気に入り機能
- [ ] アカウント情報の編集（Customer Account API の customerUpdate ミューテーション）
- [ ] 注文詳細ページ（注文単位の詳細表示）
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
