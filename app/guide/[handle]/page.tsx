import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GUIDES, getGuideByHandle } from '@/lib/guides';

const SITE_URL = 'https://shopify-nextjs-store.vercel.app';

type Props = {
  params: Promise<{ handle: string }>;
};

// 静的パスを事前生成（SSG）
export function generateStaticParams() {
  return GUIDES.map((g) => ({ handle: g.handle }));
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const guide = getGuideByHandle(handle);
  if (!guide) return { title: 'ガイド記事が見つかりません' };
  return {
    title: guide.title,
    description: guide.description,
  };
}

// GEO: HowTo スキーマ（AIがステップバイステップの手順として認識する）
function HowToJsonLd({ guide }: { guide: ReturnType<typeof getGuideByHandle> }) {
  if (!guide) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    step: guide.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ガイド', item: `${SITE_URL}/guide` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `${SITE_URL}/guide/${guide.handle}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

export default async function GuideDetailPage({ params }: Props) {
  const { handle } = await params;
  const guide = getGuideByHandle(handle);

  if (!guide) notFound();

  return (
    <>
      <HowToJsonLd guide={guide} />

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* パンくず */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-900 transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/guide" className="hover:text-gray-900 transition-colors">ガイド</Link>
          <span>/</span>
          <span className="text-gray-600">{guide.title}</span>
        </div>

        {/* 記事ヘッダー */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {guide.category}
            </span>
            <span className="text-xs text-gray-400">{guide.readTime}</span>
            <span className="text-xs text-gray-400">{guide.date}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{guide.title}</h1>
          <p className="text-gray-500 leading-relaxed">{guide.description}</p>
        </div>

        {/* ステップ */}
        <div className="space-y-8 mb-12">
          {guide.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <div className="flex-1 pt-1">
                <h2 className="font-bold text-gray-900 mb-2">{step.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ワンポイントアドバイス */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <h2 className="font-bold text-gray-900 mb-4">初心者へのワンポイント</h2>
          <ul className="space-y-2">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 関連コレクションへのCTA */}
        <div className="border border-gray-200 rounded-xl p-6 text-center">
          <p className="font-medium text-gray-900 mb-1">商品を探す</p>
          <p className="text-sm text-gray-500 mb-4">
            ガイドで紹介したギアを実際に見てみましょう。
          </p>
          <Link
            href={`/collections/${guide.collectionHandle}`}
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            {guide.collectionTitle}
          </Link>
        </div>
      </div>
    </>
  );
}
