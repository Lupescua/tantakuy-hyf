import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';

export function getUserFromCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
