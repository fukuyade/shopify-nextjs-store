import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          新しいスタイルを
          <br />
          見つけよう
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          厳選されたアイテムをお届けします。
          あなたにぴったりの一点を探してみてください。
        </p>
        <Link href="#products">
          <Button variant="primary" className="text-base px-8 py-4">
            商品を見る
          </Button>
        </Link>
      </div>
    </section>
  );
}
