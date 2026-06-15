import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerName, setCustomerPhone, UnauthorizedError } from '@/lib/customer-account';
import { COOKIE } from '@/lib/auth-cookies';

// POST /api/account/profile  { firstName, lastName, phone? }
// ログイン中の顧客の名前（必須）と電話番号（任意・メタフィールド）を更新する
export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE.accessToken)?.value;
  if (!token) {
    return NextResponse.json({ ok: false, message: 'ログインが必要です。' }, { status: 401 });
  }

  let body: { firstName?: string; lastName?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: '不正なリクエストです。' }, { status: 400 });
  }

  const firstName = (body.firstName ?? '').trim();
  const lastName = (body.lastName ?? '').trim();
  const phone = (body.phone ?? '').trim();
  if (!firstName || !lastName) {
    return NextResponse.json({ ok: false, message: '姓と名を入力してください。' }, { status: 400 });
  }

  try {
    // 名前（必須）を保存
    const result = await updateCustomerName(token, firstName, lastName);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    // 電話番号（任意）が入力されていればメタフィールドに保存。
    // 失敗しても名前は保存済みなので、致命的扱いにはしない。
    let phoneSaved = true;
    if (phone) {
      const phoneResult = await setCustomerPhone(token, phone);
      phoneSaved = phoneResult.ok;
    }
    return NextResponse.json({ ok: true, phoneSaved }, { status: 200 });
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
