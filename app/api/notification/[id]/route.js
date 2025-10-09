import { withAuth } from '@/utils/authMiddleware';
import Notification from '../../models/Notifications';
import {
  serverError,
  success,
  badRequest,
  notFound,
  forbidden,
} from '@/utils/apiResponse';
import { isValidObjectId } from 'mongoose';

async function deleteNotification(request, context) {
  const { id } = await context.params;

  // Validate ObjectId format
  if (!isValidObjectId(id)) {
    return badRequest('Invalid notification ID format');
  }

  try {
    // First, find the notification to check ownership
    const notification = await Notification.findById(id);

    if (!notification) {
      return notFound('Notification not found');
    }

    // Authorization: verify the notification belongs to the authenticated user
    const userId = context.user.id;
    if (notification.recipient.toString() !== userId) {
      return forbidden('You can only delete your own notifications');
    }

    // Delete the notification
    await Notification.findByIdAndDelete(id);
    return success({});
  } catch (err) {
    console.error('Error deleting notification:', err);
    return serverError('Failed to delete notification', err);
  }
}

export const DELETE = withAuth(deleteNotification);
