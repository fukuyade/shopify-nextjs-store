'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

// 自動スライドの間隔（ミリ秒）
const SLIDE_INTERVAL = 5000;

// バナー画像は public/banners/{handle}.jpg に置く
// 例: public/banners/snowboard.jpg, summer.jpg, water.jpg, outdoor.jpg
function bannerSrc(handle: string): string {
  return `/banners/${handle}.jpg`;
}

export default function HeroSection() {
  const slides = COLLECTIONS;
  const count = slides.length;
  const [index, setIndex] = useState(0);

  // 一定時間ごとに次のスライドへ
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {/* スライド本体（画像をクリックでコレクションへ） */}
      <div className="relative h-[56vw] max-h-[560px] min-h-[320px]">
        {slides.map((c, i) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={bannerSrc(c.handle)}
              alt={c.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* 文字を読みやすくする薄い暗幕（下側を濃く） */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            {/* テキスト（小さめ・左下） */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 max-w-xl text-white">
              <h2 className="text-lg sm:text-2xl font-bold drop-shadow-sm">{c.title}</h2>
              <p className="hidden sm:block text-sm text-gray-200 mt-1 drop-shadow-sm">
                {c.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* インジケーター（ドット）。クリックで任意のスライドへ */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        {slides.map((c, i) => (
          <button
            key={c.handle}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${c.title} を表示`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
