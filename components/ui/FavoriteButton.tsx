'use client';

import { useFavorites, FavoriteItem } from '@/context/FavoritesContext';

type Props = {
  item: FavoriteItem;
  className?: string;
  // ラベル付き（商品詳細用）か、アイコンのみ（カード用）か
  withLabel?: boolean;
};

// お気に入りの追加/解除を切り替えるハートボタン。
// 商品カードの<Link>内に置いても遷移しないよう、クリックを止める。
export default function FavoriteButton({ item, className = '', withLabel = false }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(item.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(item);
  }

  // ラベル付き（詳細ページ）
  if (withLabel) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
          active
            ? 'border-rose-500 bg-rose-50 text-rose-600'
            : 'border-gray-300 text-gray-700 hover:border-gray-900'
        } ${className}`}
      >
        <HeartIcon filled={active} />
        {active ? 'お気に入り済み' : 'お気に入りに追加'}
      </button>
    );
  }

  // アイコンのみ（カードの画像右上）
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'お気に入りから外す' : 'お気に入りに追加'}
      aria-pressed={active}
      className={`flex items-center justify-center rounded-full bg-white/90 shadow-sm w-8 h-8 transition-colors hover:bg-white ${className}`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 transition-colors ${filled ? 'text-rose-500' : 'text-gray-400'}`}
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}
