import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/customer-account';
import { COOKIE, setSessionCookies, clearSessionCookies } from '@/lib/auth-cookies';

// GET /api/auth/refresh?return=/account
// アクセストークン失効時に呼ばれ、リフレッシュトークンで再発行して元のページへ戻す
export async function GET(req: NextRequest) {
  const base = process.env.APP_BASE_URL!;
  const url = new URL(req.url);
  // オープンリダイレクト対策：自サイト内のパスのみ許可
  const rawReturn = url.searchParams.get('return') || '/account';
  const returnTo = rawReturn.startsWith('/') ? rawReturn : '/account';

  const refreshToken = req.cookies.get(COOKIE.refreshToken)?.value;
  if (!refreshToken) {
    return NextResponse.redirect(`${base}/login`);
  }

  try {
    const token = await refreshAccessToken(refreshToken);
    const res = NextResponse.redirect(`${base}${returnTo}`);
    setSessionCookies(res, token);
    return res;
  } catch (e) {
    console.error('Token refresh error:', e);
    const res = NextResponse.redirect(`${base}/login?error=expired`);
    clearSessionCookies(res);
    return res;
  }
}
