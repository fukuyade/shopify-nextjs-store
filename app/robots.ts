/**
 * app/robots.ts
 * robots.txt の動的生成（GEO戦略）
 *
 * Next.js App Router の組み込み機能。
 * このファイルを置くだけで /robots.txt が自動生成される。
 *
 * 主要AI検索エンジンのクローラーを明示的に許可することで
 * ChatGPT・Claude・Perplexity・Google AI Overview に引用されやすくする。
 */

import { MetadataRoute } from 'next';

const SITE_URL = 'https://shopify-nextjs-store.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 一般クローラー（Googlebot 等）
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/login/', '/register/'],
      },
      {
        // GPTBot（ChatGPT）— GEO のため明示的に許可
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/login/', '/register/'],
      },
      {
        // ClaudeBot（Claude / Anthropic）— GEO のため明示的に許可
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/login/', '/register/'],
      },
      {
        // PerplexityBot — GEO のため明示的に許可
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/login/', '/register/'],
      },
      {
        // Google-Extended（Google AI Overview）
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/account/', '/login/', '/register/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
