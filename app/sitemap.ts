/**
 * app/sitemap.ts
 * 動的 sitemap.xml 生成（GEO戦略の基盤）
 *
 * Next.js App Router の組み込み機能。
 * このファイルを置くだけで /sitemap.xml が自動生成される。
 * AI クローラー（GPTBot・ClaudeBot・Perplexity 等）が全ページを発見できるようになる。
 */

import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/shopify';
import { COLLECTIONS } from '@/lib/collections';

const SITE_URL = 'https://shopify-nextjs-store.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 全商品を取得してURLを生成
  const products = await getAllProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // コレクション（大分類 + 中分類）
  const collectionUrls: MetadataRoute.Sitemap = COLLECTIONS.flatMap((c) => {
    const collectionUrl: MetadataRoute.Sitemap[number] = {
      url: `${SITE_URL}/collections/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    };
    const subUrls: MetadataRoute.Sitemap = (c.subcategories ?? []).map((s) => ({
      url: `${SITE_URL}/collections/${c.handle}/${s.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
    return [collectionUrl, ...subUrls];
  });

  // 静的ページ
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/collections`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  return [...staticUrls, ...productUrls, ...collectionUrls];
}
