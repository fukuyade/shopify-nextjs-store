'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { SubSubCategory } from '@/lib/collections';
import ProductCard from '@/components/ui/ProductCard';

type Mode = 'include' | 'exclude';

// 中分類ページの商品を、小分類チェックボックス（含める/除外の2モード）で絞り込む
export default function SubCategoryFilter({
  products,
  subSubcategories,
}: {
  products: Product[];
  subSubcategories: SubSubCategory[];
}) {
  const [mode, setMode] = useState<Mode>('include');
  const [checked, setChecked] = useState<string[]>([]);

  function toggle(handle: string) {
    setChecked((prev) =>
      prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle]
    );
  }

  // チェック中の小分類のタグ集合
  const activeTags = new Set<string>();
  subSubcategories.forEach((s) => {
    if (checked.includes(s.handle)) s.tags.forEach((t) => activeTags.add(t));
  });

  const filtered = products.filter((p) => {
    if (checked.length === 0) return true; // 何も選んでいなければ全部表示
    const hasTag = (p.tags ?? []).some((t) => activeTags.has(t));
    return mode === 'include' ? hasTag : !hasTag;
  });

  return (
    <div>
      {subSubcategories.length > 0 && (
        <div className="mb-6 border border-gray-200 rounded-xl p-4">
          {/* 含める / 除外 の切替 */}
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden mb-4 text-sm">
            <button
              type="button"
              onClick={() => setMode('include')}
              className={`px-4 py-1.5 transition-colors ${
                mode === 'include' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              含める
            </button>
            <button
              type="button"
              onClick={() => setMode('exclude')}
              className={`px-4 py-1.5 transition-colors ${
                mode === 'exclude' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              除外
            </button>
          </div>

          {/* 小分類チェックボックス */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {subSubcategories.map((s) => (
              <label key={s.handle} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked.includes(s.handle)}
                  onChange={() => toggle(s.handle)}
                  className="w-4 h-4 accent-gray-900"
                />
                {s.title}
              </label>
            ))}
          </div>

          {checked.length > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              {mode === 'include' ? '選択した小分類のみ表示中' : '選択した小分類を除外して表示中'}
            </p>
          )}
        </div>
      )}

      <p className="text-sm text-gray-400 mb-4">{filtered.length}件の商品</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">該当する商品がありません</p>
        </div>
      )}
    </div>
  );
}
