import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerWithOrders, UnauthorizedError } from '@/lib/customer-account';
import { COOKIE } from '@/lib/auth-cookies';
import ProfileForm from '@/components/sections/ProfileForm';

export const metadata = {
  title: 'お名前の登録 | DRIFT SPORTS',
  description: 'お名前を登録してください',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE.accessToken)?.value;

  if (!accessToken) {
    const hasRefresh = cookieStore.get(COOKIE.refreshToken)?.value;
    if (hasRefresh) redirect('/api/auth/refresh?return=/account/profile');
    redirect('/login');
  }

  let customer;
  try {
    customer = await getCustomerWithOrders(accessToken);
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      redirect('/api/auth/refresh?return=/account/profile');
    }
    throw e;
  }

  // 初回登録（名前未入力）でも、後からの編集でも使えるページ
  return (
    <ProfileForm
      initialLastName={customer.lastName ?? ''}
      initialFirstName={customer.firstName ?? ''}
      initialPhone={customer.phone ?? ''}
    />
  );
}
