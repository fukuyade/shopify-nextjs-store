import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerWithOrders, UnauthorizedError } from '@/lib/customer-account';
import { COOKIE } from '@/lib/auth-cookies';
import AccountView from '@/components/sections/AccountView';

export const metadata = {
  title: 'アカウント | MyStore',
  description: 'アカウント情報と注文履歴',
};

// Cookieを読むため常に動的レンダリング
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE.accessToken)?.value;

  // アクセストークンが無い場合：リフレッシュトークンがあれば復帰、無ければログインへ
  if (!accessToken) {
    const hasRefresh = cookieStore.get(COOKIE.refreshToken)?.value;
    if (hasRefresh) redirect('/api/auth/refresh?return=/account');
    redirect('/login');
  }

  try {
    const customer = await getCustomerWithOrders(accessToken);
    // 初回ログインなどで名前が未登録なら、プロフィール入力を必須化
    if (!customer.firstName || !customer.lastName) {
      redirect('/account/profile');
    }
    return <AccountView customer={customer} />;
  } catch (e) {
    // トークン失効 → リフレッシュして戻す
    if (e instanceof UnauthorizedError) {
      redirect('/api/auth/refresh?return=/account');
    }
    throw e;
  }
}
