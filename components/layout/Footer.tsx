import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ブランド */}
        <div>
          <p className="text-white font-bold text-lg mb-2">MyStore</p>
          <p className="text-sm">高品質な商品をお届けします。</p>
        </div>

        {/* リンク */}
        <div>
          <p className="text-white font-semibold mb-3">ショップ</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">商品一覧</Link></li>
            <li><Link href="/collections" className="hover:text-white transition-colors">コレクション</Link></li>
          </ul>
        </div>

        {/* サポート */}
        <div>
          <p className="text-white font-semibold mb-3">サポート</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link></li>
          </ul>
        </div>
      </div>

      {/* コピーライト */}
      <div className="border-t border-gray-800 text-center py-4 text-xs">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
}
