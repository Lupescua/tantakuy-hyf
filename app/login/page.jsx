import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/utils/server/auth';
import LoginForm from './LoginForm';


export default async function LoginPage() {
  const user = await getUserFromCookie();
  if (user) {
    redirect('/'); 
  }
  return <LoginForm />; 
}
