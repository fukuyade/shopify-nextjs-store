import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerName, UnauthorizedError } from '@/lib/customer-account';
import { COOKIE } from '@/lib/auth-cookies';

// POST /api/account/profile  { firstName, lastName }
// ログイン中の顧客の名前を更新する
export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE.accessToken)?.value;
  if (!token) {
    return NextResponse.json({ ok: false, message: 'ログインが必要です。' }, { status: 401 });
  }

  let body: { firstName?: string; lastName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: '不正なリクエストです。' }, { status: 400 });
  }

  const firstName = (body.firstName ?? '').trim();
  const lastName = (body.lastName ?? '').trim();
  if (!firstName || !lastName) {
    return NextResponse.json({ ok: false, message: '姓と名を入力してください。' }, { status: 400 });
  }

  try {
    const result = await updateCustomerName(token, firstName, lastName);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json(
        { ok: false, message: 'セッションが切れました。再度ログインしてください。' },
        { status: 401 }
      );
    }
    console.error('Profile update error:', e);
    return NextResponse.json({ ok: false, message: '更新に失敗しました。' }, { status: 500 });
  }
}
