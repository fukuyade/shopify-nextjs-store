import Image from 'next/image';
import Link from 'next/link';
import { AccountCustomer, AccountOrder } from '@/types';

// サーバーコンポーネント（フック不要）。ログアウトは route handler への通常リンク。

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
  PENDING_FULFILLMENT: '準備中',
  IN_PROGRESS: '準備中',
  OPEN: '受付中',
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
  EXPIRED: '期限切れ',
};

function OrderCard({ order }: { order: AccountOrder }) {
  const items = order.lineItems.nodes;
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 注文ヘッダー */}
      <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">注文 {order.name}</span>
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
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image.url}
                  alt={item.image.altText ?? item.name}
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
              <p className="text-sm text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">数量: {item.quantity}</p>
            </div>
            {item.totalPrice && (
              <span className="text-sm text-gray-700 flex-shrink-0">
                {formatPrice(item.totalPrice.amount, item.totalPrice.currencyCode)}
              </span>
            )}
          </li>
        ))}
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

export default function AccountView({ customer }: { customer: AccountCustomer }) {
  const orders = customer.orders;
  const displayName =
    [customer.lastName, customer.firstName].filter(Boolean).join(' ') || 'ゲスト';

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      {/* プロフィール */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{displayName} さん</h1>
          {customer.email && <p className="text-sm text-gray-500 mt-1">{customer.email}</p>}
          {customer.phone && <p className="text-sm text-gray-500 mt-0.5">{customer.phone}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/account/profile"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            プロフィールを編集
          </Link>
          {/* route handlerへの通常リンク */}
          <a
            href="/api/auth/logout"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap text-sm"
          >
            ログアウト
          </a>
        </div>
      </div>

      {/* 注文履歴 */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">注文履歴</h2>

      {orders.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">まだ注文がありません。</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            商品を見る
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
