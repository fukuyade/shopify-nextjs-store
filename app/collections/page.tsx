import Link from 'next/link';
import Image from 'next/image';
import { COLLECTIONS } from '@/lib/collections';

export default function CollectionsPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">コレクション</h1>
      <p className="text-gray-500 text-sm mb-10">カテゴリから商品を探す</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className="group relative block overflow-hidden rounded-2xl aspect-[4/3]"
          >
            {/* 背景写真は public/collections/{handle}.jpg */}
            <Image
              src={`/collections/${collection.handle}.jpg`}
              alt={collection.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 文字を読みやすくする暗幕（下を濃く） */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            {/* テキスト（左下） */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h2 className="text-lg font-bold drop-shadow-sm">{collection.title}</h2>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed line-clamp-2 drop-shadow-sm">
                {collection.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
