'use client';

import { useState } from 'react';

// 簡単な問い合わせフォーム。送信は /api/contact（サーバー側で検証）。
// 送信に成功すると入力欄を隠して完了メッセージを表示する。
export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('お名前・メールアドレス・お問い合わせ内容をすべて入力してください。');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setDone(true);
      } else {
        setError(data.message ?? '送信に失敗しました。時間をおいて再度お試しください。');
      }
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-6 text-center">
        <p className="font-bold text-green-800">送信しました</p>
        <p className="mt-1 text-sm text-green-700">
          お問い合わせありがとうございます。内容を確認のうえ、追ってご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors resize-y"
          placeholder="商品やご注文についてのご質問をご記入ください。"
        />
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
        {submitting ? '送信中...' : '送信する'}
      </button>
    </form>
  );
}
