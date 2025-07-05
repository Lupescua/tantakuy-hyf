import { createNotification } from '@/app/services/notificationServices';

export async function POST(req) {
  const { entryId, userId } = await req.json();

  await createNotification(entryId, userId, 'like');

  return NextResponse.json({ success: true });
}
