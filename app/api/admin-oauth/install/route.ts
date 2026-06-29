import { NextResponse } from 'next/server';
import crypto from 'crypto';

// fuku-make-app2をAdmin APIの通常OAuth(認可コード)フローでインストールするための起点。
// Client Credentials Grantのトークンではproductdateの一部ミューテーションが
// 「ユーザー権限」チェックで拒否されるため、ユーザーに紐づく通常のトークンを取得する。
//
// 使い方: ブラウザでこのURLを開く(ストア管理者でログイン中であること)
//   https://shopify-nextjs-store.vercel.app/api/admin-oauth/install
// → Shopifyの承認画面が出るので「インストール」を押す
// → /api/admin-oauth/callback にリダイレクトされ、アクセストークンがログに出力される

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SCOPES = 'read_products,write_products';

export async function GET() {
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID!;
  const redirectUri = `${process.env.APP_BASE_URL}/api/admin-oauth/callback`;
  const state = crypto.randomBytes(16).toString('hex');

  const authorizeUrl = new URL(`https://${STORE_DOMAIN}/admin/oauth/authorize`);
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('scope', SCOPES);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizeUrl.toString());
  // callbackでstateを検証してCSRFを防ぐ
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
  });
  return response;
}
