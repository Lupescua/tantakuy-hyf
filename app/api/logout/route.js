import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('token');
  return Response.json({ success: true }, { status: 200 });
}
