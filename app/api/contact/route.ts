import { NextResponse } from 'next/server';

// 問い合わせフォームの送信先。
// いまはサーバー側で内容を検証し、ログに出して「受付OK」を返すだけ。
// 実際にメール送信したくなったら、下の TODO 部分でメール送信サービス
// （例: Resend / SendGrid など）を呼べばよい。

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

// ざっくりしたメール形式チェック
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

  // いまはサーバーログに残すだけ（Vercelのログで確認できる）
  console.log('[contact] new message', { name, email, length: message.length });

  // TODO: 実際にメール送信する場合はここで送信サービスを呼ぶ。
  //   例) Resend を使うなら RESEND_API_KEY を環境変数に入れ、
  //       await resend.emails.send({ from, to, subject, text }) のように送る。

  return NextResponse.json({ ok: true });
}
