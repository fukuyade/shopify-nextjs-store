import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCollectionByHandle } from '@/lib/collections';
import { getProductsByTag } from '@/lib/shopify';
import SubCategoryFilter from '@/components/sections/SubCategoryFilter';
import { getCollectionPageJsonLd, getItemListJsonLd, getBreadcrumbJsonLd } from '@/lib/structured-data';

type Props = {
  params: Promise<{ handle: string; sub: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { handle, sub } = await params;
  const collection = getCollectionByHandle(handle);
  const subcategory = collection?.subcategories.find((s) => s.handle === sub);
  if (!collection || !subcategory) return { title: 'カテゴリ' };
  return { title: `${subcategory.title}｜${collection.title}` };
}

export default async function SubCategoryPage({ params }: Props) {
  const { handle, sub } = await params;
  const collection = getCollectionByHandle(handle);
  if (!collection) notFound();

  const subcategory = collection.subcategories.find((s) => s.handle === sub);
  if (!subcategory) notFound();

  const products = await getProductsByTag(subcategory.tags);

  const collectionPageJsonLd = getCollectionPageJsonLd({
    title: subcategory.title,
    handle: `${handle}/${sub}`,
    description: `${collection.title} > ${subcategory.title}の商品一覧`,
  });
  const itemListJsonLd = getItemListJsonLd(products, subcategory.title);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'ホーム', href: '/' },
    { name: 'コレクション', href: '/collections' },
    { name: collection.title, href: `/collections/${handle}` },
    { name: subcategory.title, href: `/collections/${handle}/${sub}` },
  ]);

  return (
    <>
      {/* GEO: CollectionPage + ItemList + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* パンくず */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <Link href="/collections" className="hover:text-gray-900 transition-colors">
            コレクション一覧
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${collection.handle}`}
            className="hover:text-gray-900 transition-colors"
          >
            {collection.title}
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">{subcategory.title}</h1>
      </div>

      {/* 小分類フィルタ＋商品グリッド */}
      <SubCategoryFilter
        products={products}
        subSubcategories={subcategory.subSubcategories ?? []}
      />
    </section>
    </>
  );
}
