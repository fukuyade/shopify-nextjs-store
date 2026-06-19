// ログインページ（新方式）
// メール＋パスワードのフォームは廃止。Shopifyのホスト型ログインへ飛ばすだけ。
// 新規登録もそのログイン画面側で行える。

export const metadata = {
  title: 'ログイン | DRIFT SPORTS',
  description: 'アカウントにログイン',
};

const ERROR_MESSAGES: Record<string, string> = {
  auth: '認証に失敗しました。お手数ですが、もう一度お試しください。',
  token: 'ログイン処理に失敗しました。時間をおいて再度お試しください。',
  expired: 'セッションの有効期限が切れました。再度ログインしてください。',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERROR_MESSAGES[error] ?? 'ログインに失敗しました。' : null;

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">ログイン</h1>
      <p className="text-sm text-gray-500 mb-8">
        Shopifyの安全なログイン画面に移動します。アカウントをお持ちでない方も、その画面から登録できます。
      </p>

      {message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-6">
          {message}
        </p>
      )}

      {/* route handlerへの遷移なので next/link ではなく通常の <a> を使う */}
      <a
        href="/api/auth/login"
        className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
      >
        ログイン / 新規登録に進む
      </a>

      <p className="text-xs text-gray-400 mt-6">
        ログインにはメールアドレスへの認証コード送信などが使われます。
      </p>
    </div>
  );
}
