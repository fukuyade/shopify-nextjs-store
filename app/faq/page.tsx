import { Metadata } from 'next';
import { FAQ_CATEGORIES } from '@/lib/faq';

export const metadata: Metadata = {
  title: 'よくある質問',
  description:
    'DRIFT SPORTSへのご注文・配送・返品・サイズ選びなど、よくいただくご質問とその回答をまとめています。',
};

// GEO: FAQPage スキーマ（AI検索エンジンがQ&Aとして認識する）
function FaqJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      }))
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* ページヘッダー */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">よくある質問</h1>
          <p className="text-gray-500 text-sm">
            解決しない場合は
            <a href="/contact" className="text-gray-900 underline underline-offset-2 mx-1">
              お問い合わせフォーム
            </a>
            からご連絡ください。
          </p>
        </div>

        {/* カテゴリ別FAQ */}
        <div className="space-y-12">
          {FAQ_CATEGORIES.map((cat) => (
            <section key={cat.category}>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
                {cat.category}
              </h2>
              <dl className="space-y-6">
                {cat.items.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium text-gray-900 mb-2 flex items-start gap-2">
                      <span className="text-gray-400 font-bold shrink-0">Q.</span>
                      {item.question}
                    </dt>
                    <dd className="text-gray-600 text-sm leading-relaxed pl-6">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* 下部CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-xl p-8">
          <p className="text-gray-700 font-medium mb-2">解決しない場合は</p>
          <p className="text-gray-500 text-sm mb-6">
            お気軽にお問い合わせください。営業日2日以内にご返信いたします。
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </>
  );
}
