import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/customer-account';
import { COOKIE, setSessionCookies } from '@/lib/auth-cookies';

// GET /api/auth/callback?code=...&state=...
// Shopifyログイン後のリダイレクト先。codeをトークンに交換してCookieに保存する
export async function GET(req: NextRequest) {
  const base = process.env.APP_BASE_URL!;
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = req.cookies.get(COOKIE.state)?.value;

  // state照合（CSRF対策）
  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${base}/login?error=auth`);
  }

  try {
    const token = await exchangeCodeForToken(code);
    const res = NextResponse.redirect(`${base}/account`);
    setSessionCookies(res, token);
    // 使い終わった一時Cookieを削除
    res.cookies.delete(COOKIE.state);
    res.cookies.delete(COOKIE.nonce);
    return res;
  } catch (e) {
    console.error('Token exchange error:', e);
    return NextResponse.redirect(`${base}/login?error=token`);
  }
}
