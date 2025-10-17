import { createNotification } from '@/app/services/notificationServices';
import { success, badRequest, serverError } from '@/utils/apiResponse';
import { withAuth } from '@/utils/authMiddleware';
import { isValidObjectId } from 'mongoose';

async function createLikeNotification(req, context) {
  const { entryId } = await req.json();

  // Validate input
  if (!entryId) {
    return badRequest('Missing required field: entryId');
  }

  if (!isValidObjectId(entryId)) {
    return badRequest('Invalid entryId');
  }

  // Get authenticated user from context
  const userId = context.user.id;
  const userRole = context.user.role;
  const actorType = userRole === 'company' ? 'Company' : 'Participant';

  try {
    await createNotification(entryId, userId, 'like', actorType);
    return success({});
  } catch (err) {
    console.error('Error creating like notification:', err);
    return serverError('Failed to create notification', err);
  }
}

export const POST = withAuth(createLikeNotification);
