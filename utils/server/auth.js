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
