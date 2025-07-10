// force this page to be server-rendered on every request
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/utils/jwt';
import HomeClient from './HomeClient';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    try {
      const { id, role } = await verifyToken(token);
      if (role === 'company') {
        // Server-side redirect for company users
        return redirect(`/company/${id}/profile`);
      }
    } catch (err) {
      // invalid or expired token → render public home
    }
  }
<<<<<<< HEAD
=======
  return (
    <>
      <main className="home">
        <header className="header">
          <h1 className="logo">FORSIDE</h1>
        </header>
>>>>>>> adaf37e (Translated from english to danish all pages part 1)

  // No valid company token → render the client component
  return <HomeClient />;
}
