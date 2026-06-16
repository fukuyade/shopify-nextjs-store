import Link from 'next/link';
import Image from 'next/image';
import { COLLECTIONS } from '@/lib/collections';

// Heroの下に出す「人気カテゴリ」。public/collections/{handle}.jpg を背景に使う。
export default function CategoryTiles() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
      <h2 className="text-xl font-bold text-gray-900 mb-5">人気カテゴリ</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
          >
            <Image
              src={`/collections/${c.handle}.jpg`}
              alt={c.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-white font-bold text-sm sm:text-base drop-shadow">
              {c.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
