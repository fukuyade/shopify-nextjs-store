'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 初回ログイン後に名前（必須）を入力するフォーム。
// 保存は /api/account/profile（サーバー側でCookieのトークンを使ってcustomerUpdate）。

export default function ProfileForm({
  initialLastName,
  initialFirstName,
}: {
  initialLastName: string;
  initialFirstName: string;
}) {
  const router = useRouter();
  const [lastName, setLastName] = useState(initialLastName);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!lastName.trim() || !firstName.trim()) {
      setError('姓と名を入力してください。');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastName, firstName }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        router.replace('/account');
        router.refresh();
      } else if (res.status === 401) {
        router.replace('/login');
      } else {
        setError(data.message ?? '更新に失敗しました。');
      }
    } catch {
      setError('通信エラーが発生しました。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">お名前の登録</h1>
      <p className="text-sm text-gray-500 mb-8">
        ご利用を続けるには、お名前の登録をお願いします。
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              姓 <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
              placeholder="山田"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              名 <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
              placeholder="太郎"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '保存中...' : '保存して続ける'}
        </button>
      </form>
    </div>
  );
}
