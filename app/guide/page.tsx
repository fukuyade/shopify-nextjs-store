import { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'スポーツギアガイド',
  description:
    'スノーボード・テニス・アウトドアなど、はじめてのスポーツギア選びに役立つガイド記事をまとめています。初心者でも迷わない選び方を解説。',
};

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* ページヘッダー */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">スポーツギアガイド</h1>
        <p className="text-gray-500 text-sm">
          はじめてのギア選びで迷わないための選び方ガイドです。
        </p>
      </div>

      {/* ガイド記事一覧 */}
      <div className="space-y-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.handle}
            href={`/guide/${guide.handle}`}
            className="block group border border-gray-200 rounded-xl p-6 hover:border-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {guide.category}
              </span>
              <span className="text-xs text-gray-400">{guide.readTime}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 group-hover:underline underline-offset-2 mb-2">
              {guide.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{guide.description}</p>
            <p className="text-xs text-gray-400 mt-3">{guide.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
