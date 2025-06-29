import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  const token = tokenCookie?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch (error) {
    console.error('verifyToken failed:', error);
    return null;
  }
}

export async function getUserFromRequest(req) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(';')
    .find((cookie) => cookie.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
