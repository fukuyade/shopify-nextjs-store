import { NextResponse } from 'next/server';
import { TokenSet } from '@/types';

/* =========================================================
 * 認証Cookieの名前と設定をまとめる
 * - トークン類は httpOnly（JSから読めない＝XSS対策）
 * - cust_logged_in だけは読み取り可能（Headerの表示用、機密でない）
 * ======================================================= */

export const COOKIE = {
  accessToken: 'cust_at',
  refreshToken: 'cust_rt',
  idToken: 'cust_it',
  expiresAt: 'cust_exp',
  loggedIn: 'cust_logged_in',
  state: 'oauth_state',
  nonce: 'oauth_nonce',
} as const;

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const secureBase = { secure: true, sameSite: 'lax' as const, path: '/' };

// ログイン成功・リフレッシュ時にトークンCookieをまとめてセット
export function setSessionCookies(res: NextResponse, token: TokenSet) {
  res.cookies.set(COOKIE.accessToken, token.access_token, {
    ...secureBase,
    httpOnly: true,
    maxAge: token.expires_in,
  });
  res.cookies.set(COOKIE.refreshToken, token.refresh_token, {
    ...secureBase,
    httpOnly: true,
    maxAge: THIRTY_DAYS,
  });
  // id_tokenはリフレッシュ時には返らないため、ある時だけ更新
  if (token.id_token) {
    res.cookies.set(COOKIE.idToken, token.id_token, {
      ...secureBase,
      httpOnly: true,
      maxAge: THIRTY_DAYS,
    });
  }
  res.cookies.set(COOKIE.expiresAt, String(Date.now() + token.expires_in * 1000), {
    ...secureBase,
    httpOnly: true,
    maxAge: THIRTY_DAYS,
  });
  // Headerが参照する読み取り可能フラグ
  res.cookies.set(COOKIE.loggedIn, '1', {
    ...secureBase,
    httpOnly: false,
    maxAge: THIRTY_DAYS,
  });
}

// ログアウト・失効時にすべてのセッションCookieを削除
export function clearSessionCookies(res: NextResponse) {
  for (const name of [
    COOKIE.accessToken,
    COOKIE.refreshToken,
    COOKIE.idToken,
    COOKIE.expiresAt,
    COOKIE.loggedIn,
  ]) {
    res.cookies.delete(name);
  }
}
