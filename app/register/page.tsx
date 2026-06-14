import { redirect } from 'next/navigation';

// 新方式では新規登録もShopifyのホスト型ログイン画面で行うため、
// /register は /login（＝Shopifyログインへの入口）にリダイレクトする。
export default function RegisterPage() {
  redirect('/login');
}
