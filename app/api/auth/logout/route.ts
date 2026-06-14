import { NextRequest, NextResponse } from 'next/server';
import { buildLogoutUrl } from '@/lib/customer-account';
import { COOKIE, clearSessionCookies } from '@/lib/auth-cookies';

// GET /api/auth/logout
// Cookieを消し、Shopify側のセッションも終了させる（end_session_endpoint）
export async function GET(req: NextRequest) {
  const idToken = req.cookies.get(COOKIE.idToken)?.value;
  const logoutUrl = await buildLogoutUrl(idToken);

  const res = NextResponse.redirect(logoutUrl);
  clearSessionCookies(res);
  return res;
}
