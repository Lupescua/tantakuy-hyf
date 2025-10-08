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
    const result = verifyToken(token);
    if (result.ok) {
      const { id, role } = result.payload;
      if (role === 'company') {
        // Server-side redirect for company users
        return redirect(`/company/${id}/profile`);
      }
    }
    // invalid or expired token → render public home
  }

  // No valid company token → render the client component
  return <HomeClient />;
}
