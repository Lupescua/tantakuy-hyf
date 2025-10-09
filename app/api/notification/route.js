import Notification from '../models/Notifications';
import Entry from '../models/Entry';
import Participant from '../models/Participant';
import Company from '../models/Company';
import Competition from '../models/Competition';
import { withAuth } from '@/utils/authMiddleware';
import { badRequest, serverError, success, forbidden } from '@/utils/apiResponse';

async function getNotifications(req, context) {
  // Get authenticated user's ID from token
  const authenticatedUserId = context.user.id;

  // Check if requesting own notifications or another user's
  const requestedUserId = req.nextUrl.searchParams.get('userId');

  // If userId param is provided, verify it matches authenticated user
  if (requestedUserId && requestedUserId !== authenticatedUserId) {
    return forbidden('You can only view your own notifications');
  }

  // Use authenticated user's ID
  const userId = authenticatedUserId;

  const notifications = await Notification.find({ recipient: userId })
    .populate({
      path: 'actor',
      select: 'userName companyName',
    })
    .populate({
      path: 'entry',
      select: 'competition',
      populate: {
        path: 'competition',
        select: 'title',
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  // Normalize the data to return `id` instead of `_id`, and handle missing references
  const cleaned = notifications.map((n) => ({
    id: n._id.toString(), // Normalize main notification ID
    actor: {
      id: n.actor?._id?.toString() || '', // Fallback to empty string if actor missing
      userName: n.actor?.userName ?? n.actor?.companyName,
    },
    entry: {
      id: n.entry?._id?.toString() || '', // Fallback for missing entry
      caption: n.entry?.caption || '', // Default caption if missing
    },
    competition: {
      id: n.entry?.competition?._id,
      title: n.entry?.competition?.title,
    },
    type: n.type, // Either 'like' or 'share' (or other types if added later)
  }));

  // Return the normalized notification list
  return success({ notifications: cleaned });
}

export const GET = withAuth(getNotifications);

async function deleteNotifications(req, context) {
  // Get authenticated user's ID from token
  const authenticatedUserId = context.user.id;

  // Check if requesting to delete own notifications or another user's
  const requestedUserId = req.nextUrl.searchParams.get('userId');

  // If userId param is provided, verify it matches authenticated user
  if (requestedUserId && requestedUserId !== authenticatedUserId) {
    return forbidden('You can only delete your own notifications');
  }

  // Use authenticated user's ID
  const userId = authenticatedUserId;

  try {
    await Notification.deleteMany({ recipient: userId });
    return success({});
  } catch (err) {
    console.error('Error deleting notifications:', err);
    return serverError('Failed to delete notifications', err);
  }
}

export const DELETE = withAuth(deleteNotifications);
