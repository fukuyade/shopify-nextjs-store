/**
 * lib/structured-data.ts
 * GEO（AI検索最適化）用 JSON-LD スキーマ生成ユーティリティ
 *
 * 各ページの page.tsx でインポートして使用する。
 * 参考: https://schema.org/
 */

import { Product, ProductDetail } from '@/types';
import { Collection, SubCategory } from '@/lib/collections';

const SITE_URL = 'https://shopify-nextjs-store.vercel.app';
const BRAND_NAME = 'DRIFT SPORTS';
const BRAND_DESCRIPTION =
  'ウィンター・サマー・ボール・アウトドア。四季のアクティビティを、これから始める人にも選びやすく。初心者歓迎のスポーツギア・セレクトショップ。';

// ─────────────────────────────────────────────
// 1. Organization + WebSite（app/layout.tsx 用）
//    AI検索エンジンにブランド・サイト全体を認識させる
// ─────────────────────────────────────────────
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND_NAME,
        url: SITE_URL,
        description: BRAND_DESCRIPTION,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        description: BRAND_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        // AI検索エンジンにサイト内検索を伝える
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

// ─────────────────────────────────────────────
// 2. Product（app/products/[handle]/page.tsx 用）
//    商品詳細ページに商品情報を構造化して伝える
// ─────────────────────────────────────────────
export function getProductJsonLd(product: ProductDetail) {
  const image = product.images.edges[0]?.node;
  const minPrice = product.priceRange.minVariantPrice;
  const available = product.variants.edges.some((e) => e.node.availableForSale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    url: `${SITE_URL}/products/${product.handle}`,
    image: image
      ? {
          '@type': 'ImageObject',
          url: image.url,
          description: image.altText ?? product.title,
        }
      : undefined,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    keywords: product.tags?.join(', '),
    offers: {
      '@type': 'Offer',
      priceCurrency: minPrice.currencyCode,
      price: minPrice.amount,
      availability: available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${product.handle}`,
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
    },
  };
}

// ─────────────────────────────────────────────
// 3. ItemList（コレクションページ / トップページ用）
//    商品リストをAIが一覧として認識できるようにする
// ─────────────────────────────────────────────
export function getItemListJsonLd(
  products: Product[],
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/products/${p.handle}`,
      image: p.images.edges[0]?.node.url,
    })),
  };
}

// ─────────────────────────────────────────────
// 4. BreadcrumbList（各ページ共通）
//    AIにページの階層構造（位置）を伝える
// ─────────────────────────────────────────────
export function getBreadcrumbJsonLd(
  crumbs: { name: string; href: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.href.startsWith('http')
        ? crumb.href
        : `${SITE_URL}${crumb.href}`,
    })),
  };
}

// ─────────────────────────────────────────────
// 5. CollectionPage（コレクションページ用）
//    カテゴリページをAIが専用ページとして認識する
// ─────────────────────────────────────────────
export function getCollectionPageJsonLd(
  collection: Pick<Collection, 'title' | 'handle' | 'description'>
    | { title: string; handle: string; description?: string }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description,
    url: `${SITE_URL}/collections/${collection.handle}`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}
