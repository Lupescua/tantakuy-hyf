import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  const token = tokenCookie?.value;

  if (!token) return null;

  const result = verifyToken(token);
  if (!result.ok) {
    return null;
  }
  return { id: result.payload.id, role: result.payload.role };
}
