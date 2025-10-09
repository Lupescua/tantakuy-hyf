import { createNotification } from '@/app/services/notificationServices';
import { success } from '@/utils/apiResponse';

export async function POST(req) {
  const { entryId, userId } = await req.json();

  await createNotification(entryId, userId, 'like');

  return success({});
}
