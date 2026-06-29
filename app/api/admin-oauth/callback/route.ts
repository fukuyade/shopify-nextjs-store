import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// /api/admin-oauth/install からのリダイレクト先。
// Shopifyから受け取ったcodeをアクセストークンに交換する。
// このトークンは「ユーザーに紐づく」ため、productUpdate等の制限を受けず、
// 通常はアプリがアンインストールされるまで失効しない。
//
// トークンはレスポンスとして一度だけ表示する(画面に表示するのみで保存はしない)。
// 確認後、SHOPIFY_ADMIN_ACCESS_TOKENとしてVercelの環境変数に設定し、
// app/api/webhooks/shopify-handle/route.ts を固定トークン方式に戻す。

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;

function verifyHmac(searchParams: URLSearchParams): boolean {
  const secret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET!;
  const hmac = searchParams.get('hmac');
  if (!hmac) return false;

  const params = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'hmac' && key !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const digest = crypto.createHmac('sha256', secret).update(params).digest('hex');

  const a = Buffer.from(digest);
  const b = Buffer.from(hmac);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const shop = searchParams.get('shop');
  const storedState = request.cookies.get('shopify_oauth_state')?.value;

  if (!code || shop !== STORE_DOMAIN) {
    return NextResponse.json({ ok: false, message: 'パラメータが不正です。' }, { status: 400 });
  }
  if (!state || state !== storedState) {
    return NextResponse.json({ ok: false, message: 'state検証に失敗しました。' }, { status: 400 });
  }
  if (!verifyHmac(searchParams)) {
    return NextResponse.json({ ok: false, message: 'HMAC検証に失敗しました。' }, { status: 400 });
  }

  const res = await fetch(`https://${STORE_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_ADMIN_CLIENT_ID,
      client_secret: process.env.SHOPIFY_ADMIN_CLIENT_SECRET,
      code,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ ok: false, message: 'トークン交換に失敗しました。', detail }, { status: 502 });
  }

  const data = await res.json();

  // 画面に一度だけ表示する(ログにも残さない)。確認後はこのページを閉じてよい。
  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;">
      <h1>インストール完了</h1>
      <p>以下のアクセストークンを SHOPIFY_ADMIN_ACCESS_TOKEN としてVercelの環境変数に保存してください。このページを閉じると再表示できません。</p>
      <pre style="background:#eee;padding:1rem;word-break:break-all;">${data.access_token}</pre>
      <p>scope: ${data.scope}</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
