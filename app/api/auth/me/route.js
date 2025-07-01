import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return Response.json({ success: false }, { status: 401 });
  }
  try {
    const user = verifyToken(token);
    return Response.json({ success: true, user }, { status: 200 });
  } catch {
    return Response.json({ success: false }, { status: 401 });
  }
}
