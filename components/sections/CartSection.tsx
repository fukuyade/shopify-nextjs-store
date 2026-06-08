'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default function CartSection() {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  if (!cart || cart.totalQuantity === 0) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">カートは空です</h1>
        <p className="text-gray-500 mb-8">商品を追加してみましょう</p>
        <Link href="/">
          <Button variant="primary">商品一覧を見る</Button>
        </Link>
      </section>
    );
  }

  const lines = cart.lines.edges.map((e) => e.node);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">カート</h1>

      {/* 商品一覧 */}
      <div className="divide-y divide-gray-200">
        {lines.map((line) => {
          const image = line.merchandise.product.images.edges[0]?.node;
          const productTitle = line.merchandise.product.title;
          const variantTitle = line.merchandise.title;
          const price = line.merchandise.price;
          const lineTotal = parseFloat(price.amount) * line.quantity;

          return (
            <div key={line.id} className="flex gap-4 py-6">
              {/* 商品画像 */}
              <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.altText ?? productTitle}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* 商品情報 */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      {productTitle}
                    </Link>
                    {variantTitle !== 'Default Title' && (
                      <p className="text-sm text-gray-500 mt-1">{variantTitle}</p>
                    )}
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => removeItem(line.id)}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 text-sm"
                  >
                    削除
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* 個数変更 */}
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateItem(line.id, line.quantity - 1)}
                      disabled={isLoading || line.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-l-md"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={isLoading}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 rounded-r-md"
                    >
                      ＋
                    </button>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {formatPrice(String(lineTotal), price.currencyCode)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 合計・チェックアウト */}
      <div className="border-t border-gray-200 pt-6 mt-4">
        <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
          <span>合計</span>
          <span>
            {formatPrice(
              cart.cost.totalAmount.amount,
              cart.cost.totalAmount.currencyCode
            )}
          </span>
        </div>

        <a href={cart.checkoutUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" className="w-full py-4 text-base">
            レジに進む
          </Button>
        </a>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← 買い物を続ける
          </Link>
        </div>
      </div>
    </section>
  );
}
