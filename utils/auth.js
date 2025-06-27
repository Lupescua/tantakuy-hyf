import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';

export default async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
