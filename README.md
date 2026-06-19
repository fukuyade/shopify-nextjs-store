# DRIFT SPORTS

**四季のスポーツを、これから始める人へ。** ウィンター・サマー・ボール・アウトドアの4ジャンルを横断する、初心者にやさしいスポーツギアのセレクトショップ（ECサイト）です。

Shopify をバックエンド（ヘッドレス構成）に、フロントを Next.js（App Router）で実装した学習・ポートフォリオプロジェクトです。商品管理・在庫・決済は Shopify、表示と体験は自作フロントエンド、という実務に近い構成で作っています。

🔗 **デモサイト**: https://shopify-nextjs-store.vercel.app

---

## 技術スタック

| 領域 | 使用技術 |
| --- | --- |
| フレームワーク | Next.js 15（App Router / Server & Client Components） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| 商品・カート | Shopify Storefront API（GraphQL） |
| 認証・注文履歴 | Shopify Customer Account API（OAuth2 / Confidential client） |
| メール送信 | Resend（お問い合わせフォーム） |
| ホスティング | Vercel |
| バージョン管理 | Git / GitHub |

---

## 主な機能

- **商品一覧・商品詳細**（画像ギャラリー・バリアント選択・カート追加）
- **カート**（追加 / 個数変更 / 削除 / 小計表示 / Shopify チェックアウトへ遷移・localStorage で永続化）
- **3 階層カテゴリ**（大分類＝コレクション → 中分類 → 小分類）。すべて商品タグで横断的に絞り込み、小分類はチェックボックスで「含める / 除外」フィルタ
- **特集（Features）**: コレクションとは別軸の「テーマ別まとめ」。タグ駆動の商品ページに加え、ブロック（バナー / 見出し / 本文 / 商品グリッド）を並べて**投稿ごとに作り込める**詳細テンプレート。公開 ON/OFF・投稿日順の並びをデータで管理
- **お気に入り**（ハートで保存・件数バッジ・一覧ページ・localStorage 永続化）
- **会員機能**: Customer Account API による OAuth2 ログイン、注文履歴、初回プロフィール（氏名必須・電話はメタフィールド）登録
- **お問い合わせフォーム**（サーバー側バリデーション＋ Resend でメール通知）
- **検索**・**レスポンシブ対応**（モバイルメニュー / メガメニュー）

---

## 設計上の工夫（ポイント）

**ヘッドレス構成での役割分担**
商品・在庫・決済は Shopify に任せ、表示と UX は Next.js 側で自作。Storefront API（公開データ）と Customer Account API（認証）で叩く API を分け、用途に応じて使い分けています。

**Server / Client Component の使い分け**
データ取得は Server Component（高速・SEO・秘匿）、ユーザー操作が要る部分（カート・お気に入り・フィルタ・フォーム）だけ `'use client'` のクライアントへ。責務を明確に分離しています。

**秘密情報をブラウザに出さない**
お問い合わせは「ブラウザ → 自前の API Route → Resend」と中継し、API キーはサーバーの環境変数からのみ参照。Customer Account API も Confidential クライアントで、トークンは httpOnly Cookie に保存し自動リフレッシュします。

**タグ駆動のカテゴリ設計**
大・中・小すべてのカテゴリを「商品タグでの絞り込み」に統一し、入れ子のデータ構造で表現。フィールドを追加していく方式にして、機能を壊さず段階的に拡張できるようにしています。

**データで運用できる特集テンプレート**
特集は `lib/features.ts` を編集するだけで、公開状態・並び順・ページ構成（ブロック）を管理可能。商品取得はサーバー、描画はコンポーネント、と分けて再利用性を確保しています。

**状態管理は React Context ＋ localStorage**
カートとお気に入りは Context で全画面に共有し、`useEffect` で localStorage と同期。サーバー描画とクライアント初期描画を一致させ、ハイドレーションのズレを避けています。

---

## ディレクトリ構成（抜粋）

```
app/
  page.tsx                       # トップ（Hero / 特集 / おすすめ / コレクション別）
  products/[handle]/             # 商品詳細
  collections/[handle]/[sub]/    # 大→中→小分類ページ
  features/[handle]/             # 特集（ブロック型テンプレート対応）
  cart/ favorites/ search/       # カート・お気に入り・検索
  account/ login/                # 会員（Customer Account API）
  contact/ about/                # お問い合わせ・About
  api/auth/* api/contact/        # 認証フロー・問い合わせ送信
components/   # layout / sections / ui（ProductCard, FavoriteButton 等）
context/      # CartContext, FavoritesContext, AuthContext
lib/          # shopify.ts, customer-account.ts, collections.ts, features.ts
```

---

## セットアップ

```bash
npm install
npm run dev
# http://localhost:3000
```

`.env.local` に以下を設定します（値は Shopify / Resend で取得）。

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=xxxx.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxx

# Customer Account API（OAuth2・Confidential）
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=xxxx
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET=xxxx
SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI=https://<your-app>.vercel.app/api/auth/callback
APP_BASE_URL=https://<your-app>.vercel.app

# お問い合わせメール（Resend）
RESEND_API_KEY=re_xxxx
CONTACT_TO_EMAIL=you@example.com
```

> 注: Customer Account API は localhost では動作しません（Shopify がリダイレクトを許可しないため）。認証まわりの動作確認は Vercel のデプロイ先で行ってください。Vercel の環境変数は `.env.local` とは別管理のため、変更後は Redeploy が必要です。

---

## 今後の予定

- 商品説明の充実・実物写真への差し替え
- 注文詳細ページ、お気に入りのログイン同期
- 特集バナー画像・ブロック種類の拡充

---

学習の記録（実装日誌）は別途まとめています。Next.js / Shopify を題材に、「実装 → 検証 → 少しずつ公開」を繰り返しながら、実店舗でも使えるレベルを目指して制作しました。
