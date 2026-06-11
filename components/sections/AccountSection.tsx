'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import Button from '@/components/ui/Button';

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

// 配送ステータスの日本語ラベル
const FULFILLMENT_LABELS: Record<string, string> = {
  FULFILLED: '発送済み',
  UNFULFILLED: '未発送',
  PARTIALLY_FULFILLED: '一部発送',
  RESTOCKED: '返品済み',
  IN_PROGRESS: '準備中',
  ON_HOLD: '保留中',
  SCHEDULED: '発送予定',
};

// 支払いステータスの日本語ラベル
const FINANCIAL_LABELS: Record<string, string> = {
  PAID: '支払い済み',
  PENDING: '保留中',
  REFUNDED: '返金済み',
  PARTIALLY_REFUNDED: '一部返金',
  PARTIALLY_PAID: '一部支払い',
  VOIDED: '無効',
  AUTHORIZED: '承認済み',
};

function OrderCard({ order }: { order: Order }) {
  const items = order.lineItems.edges.map((e) => e.node);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 注文ヘッダー */}
      <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">注文 #{order.orderNumber}</span>
          <span className="text-sm text-gray-500">{formatDate(order.processedAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white">
            {FULFILLMENT_LABELS[order.fulfillmentStatus] ?? order.fulfillmentStatus}
          </span>
          {order.financialStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {FINANCIAL_LABELS[order.financialStatus] ?? order.financialStatus}
            </span>
          )}
        </div>
      </div>

      {/* 商品リスト */}
      <ul className="divide-y divide-gray-100">
        {items.map((item, i) => {
          const image = item.variant?.image;
          const handle = item.variant?.product?.handle;
          const content = (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.altText ?? item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    画像なし
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">数量: {item.quantity}</p>
              </div>
              {item.variant?.price && (
                <span className="text-sm text-gray-700 flex-shrink-0">
                  {formatPrice(item.variant.price.amount, item.variant.price.currencyCode)}
                </span>
              )}
            </div>
          );
          return (
            <li key={i}>
              {handle ? (
                <Link href={`/products/${handle}`} className="block hover:bg-gray-50 transition-colors">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>

      {/* 合計 */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-500">合計</span>
        <span className="font-semibold text-gray-900">
          {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
        </span>
      </div>
    </div>
  );
}

export default function AccountSection() {
  const router = useRouter();
  const { customer, isLoggedIn, isLoading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // 未ログインならログインページへ
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login?redirect=/account');
    }
  }, [isLoading, isLoggedIn, router]);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.replace('/');
  }

  // 復元中・リダイレクト待ち
  if (isLoading || !customer) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-24 text-center text-gray-400">
        読み込み中...
      </section>
    );
  }

  const orders = customer.orders.edges.map((e) => e.node);
  const displayName =
    [customer.lastName, customer.firstName].filter(Boolean).join(' ') || 'ゲスト';

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      {/* プロフィール */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{displayName} さん</h1>
          <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} disabled={loggingOut} className="px-4 py-2">
          {loggingOut ? 'ログアウト中...' : 'ログアウト'}
        </Button>
      </div>

      {/* 注文履歴 */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">注文履歴</h2>

      {orders.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">まだ注文がありません。</p>
          <Link href="/">
            <Button variant="primary" className="px-6 py-2">
              商品を見る
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
