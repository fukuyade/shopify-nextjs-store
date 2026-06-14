import { NextResponse } from 'next/server';
import { buildAuthorizationUrl, randomString } from '@/lib/customer-account';
import { COOKIE } from '@/lib/auth-cookies';

// GET /api/auth/login
// state/nonceを発行してCookieに保存し、Shopifyのログイン画面へリダイレクト
export async function GET() {
  const state = randomString(16);
  const nonce = randomString(16);
  const authUrl = await buildAuthorizationUrl(state, nonce);

  const res = NextResponse.redirect(authUrl);
  // CSRF対策のため、Shopifyから戻ってきたときにstateを照合する
  const tempOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 600, // 10分
  };
  res.cookies.set(COOKIE.state, state, tempOpts);
  res.cookies.set(COOKIE.nonce, nonce, tempOpts);
  return res;
}
