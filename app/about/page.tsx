import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

export const metadata = {
  title: 'About',
  description: 'DRIFT SPORTSについて。スノーボードからテニスまで、厳選したアウトドア・スポーツギアをお届けします。',
};

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">DRIFT SPORTS について</h1>
      <p className="mt-4 text-gray-600 leading-relaxed">
        DRIFT SPORTS は、ウィンタースポーツからボールスポーツ、アウトドアまで、
        季節やシーンを問わず「外で遊ぶ」すべての人のためのオンラインストアです。
        初めての一歩を踏み出す方にも、長く付き合える道具を探している方にも、
        自信を持っておすすめできるギアだけを厳選してお届けします。
      </p>

      <div className="mt-12 space-y-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900">わたしたちのこだわり</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            扱うのは、スタッフ自身が実際に使って「これなら勧められる」と感じたものだけ。
            価格の安さよりも、長く気持ちよく使える品質と、遊びがもっと楽しくなる体験を大切にしています。
            カテゴリごとに専門の視点で商品を選び、はじめての方が迷わないように整理してご紹介します。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">取扱カテゴリ</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            季節やアクティビティに合わせて、幅広いカテゴリを取り揃えています。
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {COLLECTIONS.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/collections/${c.handle}`}
                  className="inline-block rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">お問い合わせ</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            商品やご注文についてのご質問は、
            <Link href="/contact" className="text-gray-900 underline underline-offset-2 hover:text-gray-600">
              お問い合わせページ
            </Link>
            からお気軽にご連絡ください。
          </p>
        </div>
      </div>

      <p className="mt-16 text-xs text-gray-400">
        ※ 本サイトは学習・ポートフォリオ目的で制作したデモストアです。
      </p>
    </section>
  );
}
