import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';

export async function getUserFromCookie() {
  const cookieStore = cookies();
   const tokenCookie = await cookieStore.get('token'); 
   const token = tokenCookie?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
