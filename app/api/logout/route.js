import { cookies } from 'next/headers';

export async function POST() {
  // 1) await cookies()
  const cookieStore = await cookies();
  cookieStore.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  // 2) 204 must have no body
  return new Response(null, { status: 204 });
}
