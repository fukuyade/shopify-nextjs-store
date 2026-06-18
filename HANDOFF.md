# 引き継ぎドキュメント
## Shopify × Next.js ストア学習プロジェクト

---

## プロジェクト概要

fukuさんがNext.js・Reactを学習するために構築しているShopifyストアフロント。
ポートフォリオ兼、将来的に実店舗でそのまま使えるレベルを目指している。

- **GitHub**: https://github.com/fukuyade/shopify-nextjs-store
- **Vercel（公開URL）**: https://shopify-nextjs-store.vercel.app
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
  collections/page.tsx          # 大分類カード一覧（背景写真つき）
  collections/[handle]/page.tsx # 大分類ページ（中分類チップ＋商品一覧）
  collections/[handle]/[sub]/page.tsx # 中分類ページ（小分類フィルタ＋商品）
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
    Header.tsx    # 検索バー・カテゴリバー(大分類ホバーで中分類メガメニュー)・モバイルカテゴリ
    Footer.tsx    # コレクションリンク・サポートリンク
  sections/
    HeroSection.tsx          # コレクション別バナーの自動スライド（クライアント）
    CategoryTiles.tsx        # トップの人気カテゴリ（画像タイル）
    CollectionPreview.tsx    # トップのコレクション別グリッド＋もっと見る
    FeaturedSection.tsx      # おすすめ商品の横スクロールカルーセル
    ProductGridSection.tsx   # 商品グリッド一覧（現在トップでは未使用）
    ProductDetailSection.tsx # 商品詳細（画像・バリアント・カート追加）
    CartSection.tsx          # カート内容（個数変更・削除・チェックアウト）
    SearchResultsSection.tsx # 検索結果表示
    SubCategoryFilter.tsx    # 中分類ページの小分類チェックボックス（含める/除外・クライアント）
    AccountView.tsx          # アカウント情報・注文履歴・ログアウト（サーバーComponent）
    AccountSection.tsx       # 旧名。AccountView を再エクスポートするだけ
  ui/
    Button.tsx      # 共通ボタン（primary/secondary/outline）
    ProductCard.tsx # 商品カード

public/
  banners/{handle}.jpg      # Heroバナー画像（snowboard/summer/ball-sports/outdoor）
  collections/{handle}.jpg  # コレクションカード・人気カテゴリ用の背景写真

lib/
  shopify.ts          # Shopify Storefront API 通信（商品・カート）。getProductsByTagは複数タグOR・ダブルクォート
  customer-account.ts # Customer Account API（OAuth2・トークン交換・顧客/注文取得）
  auth-cookies.ts     # 認証Cookieの名前・set/clearヘルパー
  collections.ts      # カテゴリ定義（大分類→中分類→小分類の3階層・すべてタグ）※ユーザー管理

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
| `getProductsByTag(tags)` | 複数タグのいずれか（OR）で絞り込み（コレクション用） |
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

## カテゴリ構造（lib/collections.ts・3階層すべてタグ）

大分類（コレクション）→ 中分類 → 小分類の3階層。どの段も「商品タグでの絞り込み」で、`collections.ts` のデータ構造（入れ子）で表現している。

```typescript
export type SubSubCategory = { handle; title; tags: string[] };          // 小分類
export type SubCategory   = { handle; title; tags; subSubcategories? };  // 中分類
export type Collection    = { handle; title; tags; description; subcategories }; // 大分類
```

大分類4つ（中分類）:
- ウィンタースポーツ(snowboard) → スノーボード / スキー
- サマースポーツ(summer) → サーフィン / SUP / シュノーケル / カヤック / スケート
- ボールスポーツ(ball-sports) → テニス / バレー / 野球 / バスケットボール / サッカー
- アウトドア(outdoor) → キャンプ / 登山・トレッキング / 自転車

各中分類の下に小分類（例：ボード/ビンディング/ウェア/小物、ラケット/ボール/シューズ 等）。

ページ:
- `/collections` … 大分類カード（背景写真）
- `/collections/[大分類]` … 中分類チップ＋商品
- `/collections/[大分類]/[中分類]` … 小分類チェックボックス（含める/除外）＋商品

**重要**:
- タグはShopify商品タグと完全一致（OR検索）。日本語タグもOK。
- `collections.ts` のタグは**ユーザー管理**。編集前に必ず読み、勝手に変えない・戻さない。
- 小分類フィルタは商品の `tags` を使う → `Product` 型と `getProductsByTag` のクエリに `tags` を追加済み。

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
- [x] Heroバナーカルーセル（コレクション別バナーを5秒で自動スライド・public/banners/{handle}.jpg）
- [x] おすすめ商品をタグで管理（`Featured` または `おすすめ` タグの商品を表示。無ければ先頭4件）
- [x] コレクションカードに背景写真（public/collections/{handle}.jpg）
- [x] トップをcoca風に刷新（Hero→人気カテゴリ→おすすめ→コレクション別グリッド＋もっと見る）
- [x] 3階層カテゴリ（大分類→中分類→小分類・すべてタグ）
- [x] 中分類ページ＋小分類チェックボックス絞り込み（含める/除外）
- [x] Header大分類ホバーで中分類メガメニュー＋モバイルのカテゴリ一覧

※ Customer Account APIには電話番号の専用mutationが無い（CustomerUpdateInputは姓名のみ、CustomerPhoneNumberは読み取り専用）。
　 そのため公式の電話欄ではなく、顧客メタフィールド custom.phone として保存している。
　 注: ストアに custom.phone のメタフィールド定義（顧客リソース・顧客アクセスRead/Write）が必要な場合がある。

---

## Shopifyデータの状態

### 商品データ
- 全カテゴリに商品あり（元の商品＋空カテゴリ用に19点をAPIで追加生成）。通貨：JPY。
- 追加商品は大分類＋中分類＋小分類タグ・在庫・画像（大分類バナー流用）・公開済みで作成。
- 既存商品にも小分類タグを一括付与済み（例：既存スノーボード→`Board`）。
- 商品画像：追加商品はカテゴリ単位のバナー画像を流用（個別実物写真ではない）。

### ⚠️ 最重要の教訓（ハマりどころ）
- **Storefront APIは「公開された商品」しか返さない**。API/MCPで作った商品は未公開になりがち。
  → Shopify管理画面 or API で「オンラインストア」＋「fuku-make-app」に**公開**が必要（このストアのStorefrontトークンはfuku-make-app/オンラインストアを読む）。
- **タグ検索はダブルクォート** `tag:"値"`（シングルクォートだとStorefrontで一致しない）。
- **Vercel環境変数は `.env.local` と別管理**。変更後は**Redeploy**。Customer Account APIは**localhost不可**→確認はVercelで。
- ページは `revalidate: 60` のキャッシュ。商品/タグ変更の反映に最大1分＋ハードリロード。
- 開発環境（Cowork）はファイル同期が不安定で、編集済みファイルがbash側で壊れて見えることがある。型チェックは `/tmp` に独立環境を作って `tsc` で確認する（実ファイルは正しい）。

### handleについての注意
- 商品追加時：Shopify Admin「URLハンドル」欄で英語handleを手動設定すること。

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

- [ ] 小分類フィルタの見た目調整、未分類商品（フリスビー等）の扱い
- [ ] README.mdの作成（ポートフォリオ向け説明文）
- [ ] 追加商品の個別実物写真への差し替え（現在はカテゴリバナー流用）
- [ ] Shopifyのコレクション機能との比較・併用の検討
- [ ] お気に入り機能
- [ ] 注文詳細ページ（注文単位の詳細表示）
- [ ] Admin APIを使った商品管理機能（Next.js API Route + Admin APIトークン）

---

## 学習スタイルの引き継ぎ

- **進め方**: 実装してから解説（コードを先に書いて後で説明）。大きめの機能は**少しずつ確認→pushを繰り返す**。
- **Notionまとめ**: 各日の終わりにNotionにまとめる（**1日目〜12日目まで作成済み**）。親「ポートフォリオ」ページID `3728e1b3-2203-8099-8b73-d3ec79af4fff`。
- **GitHub**: pushは**ユーザーが自分のPCで実行**（Cowork側の同期が不安定なため）。
- **コミットメッセージ形式**: `feat:` `fix:` `refactor:` `style:` `docs:` `chore:`
- **collections.ts のタグはユーザー管理**: 編集前に必ず読み、勝手に変えない・戻さない。
- **型チェック重視**: 編集後は独立環境（/tmp）で `tsc --noEmit` 確認。
- **目標**: ポートフォリオとして提出できるレベル＋実店舗で使えるレベル

---

## 9〜12日目でやったこと（直近の作業サマリ）

- **9日目**: ユーザー認証を新方式 Customer Account API（OAuth2・Confidential）に作り替え。
- **10日目**: 初回ログイン後の名前（必須）登録＋電話（任意・メタフィールド `custom.phone`）。
- **11日目**: Heroカルーセル、コレクション整理（ウィンター/Ball Sports/複数タグOR/ダブルクォート修正）、公開状態の修正、coca風トップ、おすすめ=Featuredタグ、カード背景写真。
- **12日目**: 3階層カテゴリ（大/中/小）、中分類ページ、小分類フィルタ（含む/除外）、Headerメガメニュー、空カテゴリに商品生成＋既存商品の小分類タグ付与。

---

## Gitコマンド例

```bash
git add .
git commit -m "feat: 機能の説明"
git push origin main
```
