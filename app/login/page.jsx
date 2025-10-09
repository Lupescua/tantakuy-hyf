import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/utils/server/auth';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Log ind',
  description:
    'Log ind på Tantakuy for at deltage i konkurrencer, stemme på bidrag og vinde præmier.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function LoginPage() {
  const user = await getUserFromCookie();
  if (user) {
    redirect('/');
  }
  return <LoginForm />;
}
