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