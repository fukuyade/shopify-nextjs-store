import { NextResponse } from 'next/server';

// 問い合わせフォームの送信先。
// 入力を検証し、Resend（メール送信サービス）で指定アドレスへ通知メールを送る。
//
// 必要な環境変数（.env.local と Vercel の両方に設定）:
//   RESEND_API_KEY      … Resend の API キー（必須。無いとメールは送られずログのみ）
//   CONTACT_TO_EMAIL    … 通知の宛先（自分のメール）。未設定なら下のデフォルトを使う
//   CONTACT_FROM_EMAIL  … 送信元。未設定なら Resend のテスト用 onboarding@resend.dev
//
// ※ Resend は、独自ドメインを認証するまでは送信元 onboarding@resend.dev でのみ送信でき、
//    宛先は「Resend に登録した自分のメール」に限られる（テストにはこれで十分）。

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'fukunaga120222@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Resend REST API へメール送信（パッケージ不要・fetchのみ）
async function sendViaResend(params: { name: string; email: string; message: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // キー未設定のときは送らずにログだけ（フォーム自体は成功扱いにする）
    console.warn('[contact] RESEND_API_KEY 未設定のためメール送信をスキップしました');
    return false;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `DRIFT SPORTS お問い合わせ <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      reply_to: params.email, // 返信するとそのまま問い合わせ者へ返せる
      subject: `【お問い合わせ】${params.name} さんより`,
      text: `お名前: ${params.name}\nメールアドレス: ${params.email}\n\n${params.message}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('[contact] Resend 送信失敗', res.status, detail);
    throw new Error('mail_failed');
  }
  return true;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'リクエストの形式が不正です。' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  // 入力チェック
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: 'お名前・メールアドレス・お問い合わせ内容をすべて入力してください。' },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, message: 'メールアドレスの形式が正しくありません。' },
      { status: 400 }
    );
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { ok: false, message: 'お問い合わせ内容は2000文字以内で入力してください。' },
      { status: 400 }
    );
  }

  console.log('[contact] new message', { name, email, length: message.length });

  try {
    await sendViaResend({ name, email, message });
  } catch {
    return NextResponse.json(
      { ok: false, message: '送信処理でエラーが発生しました。時間をおいて再度お試しください。' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
