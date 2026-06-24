import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Shopifyのproducts/create・products/update webhookを受信し、
// 日本語タイトルの商品はDeepLで英訳してhandleを自動更新する。
//
// 必要な環境変数:
//   SHOPIFY_WEBHOOK_SECRET     … Webhook署名検証用（fuku-make-app2のAPIシークレット）
//   SHOPIFY_ADMIN_ACCESS_TOKEN … 商品handle更新用（fuku-make-app2のAdmin APIアクセストークン）
//   DEEPL_API_KEY              … DeepL Free APIキー
//
// Shopify管理画面で products/create と products/update の2つのwebhookを
// このエンドポイントに向けて登録しておく必要がある。

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const ADMIN_API_VERSION = '2025-01';

function hasJapanese(text: string): boolean {
  return /[぀-ヿ㐀-鿿]/.test(text);
}

function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !hmacHeader) return false;

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');

  // タイミング攻撃対策のため定数時間比較を使う
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function translateToEnglish(text: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY!;
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: 'JA',
      target_lang: 'EN',
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`DeepL翻訳に失敗しました: ${res.status} ${detail}`);
  }

  const data = await res.json();
  return data.translations[0].text as string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function updateProductHandle(productId: string, handle: string): Promise<void> {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
  const res = await fetch(`https://${STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation UpdateProductHandle($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id handle }
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: {
          id: `gid://shopify/Product/${productId}`,
          handle,
        },
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Admin API呼び出しに失敗しました: ${res.status} ${detail}`);
  }

  const data = await res.json();
  const userErrors = data.data?.productUpdate?.userErrors;
  if (userErrors?.length) {
    throw new Error(`handle更新に失敗しました: ${JSON.stringify(userErrors)}`);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');

  if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
    return NextResponse.json({ ok: false, message: '署名検証に失敗しました。' }, { status: 401 });
  }

  let payload: { id?: number; title?: string; handle?: string };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: 'リクエストの形式が不正です。' }, { status: 400 });
  }

  const { id, title, handle } = payload;

  if (!id || !title) {
    return NextResponse.json({ ok: true, skipped: 'missing id or title' });
  }

  // 日本語以外のタイトルは対象外（既存の英語handleを保護し、無限ループも防ぐ）
  if (!hasJapanese(title)) {
    return NextResponse.json({ ok: true, skipped: 'not japanese' });
  }

  // すでに翻訳済み（英語化済み）handleの場合は何もしない
  // （productUpdate後に再度発火するwebhookで無限ループにならないようにするためのガード）
  if (handle && !hasJapanese(handle)) {
    return NextResponse.json({ ok: true, skipped: 'handle already translated' });
  }

  try {
    const translated = await translateToEnglish(title);
    const newHandle = slugify(translated);

    if (!newHandle) {
      return NextResponse.json({ ok: true, skipped: 'empty slug after translation' });
    }

    await updateProductHandle(String(id), newHandle);

    console.log('[shopify-handle] handle updated', { id, title, newHandle });
    return NextResponse.json({ ok: true, handle: newHandle });
  } catch (error) {
    console.error('[shopify-handle] failed', error);
    return NextResponse.json({ ok: false, message: '処理中にエラーが発生しました。' }, { status: 500 });
  }
}
