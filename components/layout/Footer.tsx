import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* ブランド */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-white font-bold text-lg mb-2">MyStore</p>
          <p className="text-sm leading-relaxed">
            スノーボードからテニスまで、厳選されたアウトドアギアをお届けします。
          </p>
        </div>

        {/* ショップ */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">ショップ</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">商品一覧</Link></li>
            <li><Link href="/collections" className="hover:text-white transition-colors">コレクション</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">カート</Link></li>
          </ul>
        </div>

        {/* コレクション */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">カテゴリ</p>
          <ul className="space-y-2 text-sm">
            {COLLECTIONS.map((c) => (
              <li key={c.handle}>
                <Link href={`/collections/${c.handle}`} className="hover:text-white transition-colors">
                 {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* サポート */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">サポート</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
}
