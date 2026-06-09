import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gray-900 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-4">
          Sports &amp; Outdoor Store
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          新しいスタイルを
          <br />
          見つけよう
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
          スノーボードからサマースポーツまで、厳選されたギアを取り揃えています。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="#products">
            <Button variant="primary" className="text-base px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 w-full sm:w-auto">
              商品を見る
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="outline" className="text-base px-8 py-4 border-gray-600 text-gray-300 hover:border-white hover:text-white w-full sm:w-auto">
              コレクション一覧
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
