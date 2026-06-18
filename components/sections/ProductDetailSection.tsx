'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDetail, ProductVariant } from '@/types';
import Button from '@/components/ui/Button';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { useCart } from '@/context/CartContext';

type Props = {
  product: ProductDetail;
};

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default function ProductDetailSection({ product }: Props) {
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);
  const [added, setAdded] = useState(false);

  const { addItem, isLoading } = useCart();
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;

  async function handleAddToCart() {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id);
    setAdded(true);
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* 左：画像エリア */}
        <div>
          {/* メイン画像 */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].altText ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* サムネイル一覧 */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? `画像${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 右：商品情報エリア */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          <p className="text-2xl font-semibold text-gray-800">
            {formatPrice(price.amount, price.currencyCode)}
          </p>

          {/* バリアント選択（複数ある場合のみ表示） */}
          {variants.length > 1 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                オプション：{selectedVariant?.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.availableForSale}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors
                      ${selectedVariant?.id === variant.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-900'
                      }
                      ${!variant.availableForSale ? 'opacity-40 cursor-not-allowed line-through' : ''}
                    `}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* カート追加前：ボタン */}
          {!added ? (
            <Button
              variant="primary"
              className="w-full py-4 text-base"
              disabled={!selectedVariant?.availableForSale || isLoading}
              onClick={handleAddToCart}
            >
              {!selectedVariant?.availableForSale
                ? '在庫切れ'
                : isLoading
                ? '追加中...'
                : 'カートに追加'}
            </Button>
          ) : (
            /* カート追加後：2つのボタンを表示 */
            <div className="flex flex-col gap-3">
              <p className="text-center text-sm text-green-600 font-medium">
                ✓ カートに追加しました
              </p>
              <Link href="/cart">
                <Button variant="primary" className="w-full py-4 text-base">
                  カートに移動
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full py-4 text-base">
                  他の商品を探す
                </Button>
              </Link>
            </div>
          )}

          {/* お気に入り */}
          <FavoriteButton
            withLabel
            className="w-full"
            item={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              image: images[0]?.url ?? null,
              amount: product.priceRange.minVariantPrice.amount,
              currencyCode: product.priceRange.minVariantPrice.currencyCode,
            }}
          />

          {/* 商品説明 */}
          {product.descriptionHtml ? (
            <div
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}
        </div>
      </div>

      {/* 商品一覧に戻るリンク */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span>←</span>
          <span>商品一覧に戻る</span>
        </Link>
      </div>
    </section>
  );
}
