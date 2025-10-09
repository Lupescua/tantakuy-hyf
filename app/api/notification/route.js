import Notification from '../models/Notifications';
import Entry from '../models/Entry';
import Participant from '../models/Participant';
import Company from '../models/Company';
import Competition from '../models/Competition';
import { withAuth } from '@/utils/authMiddleware';
import {
  badRequest,
  serverError,
  success,
  forbidden,
} from '@/utils/apiResponse';

async function getNotifications(req, context) {
  const authenticatedUserId = context.user.id;

  const notifications = await Notification.find({
    recipient: authenticatedUserId,
  })
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
      id: n.entry?.competition?._id?.toString() || '',
      title: n.entry?.competition?.title,
    },
    type: n.type, // Either 'like' or 'share' (or other types if added later)
  }));

  // Return the normalized notification list
  return success({ notifications: cleaned });
}

export const GET = withAuth(getNotifications);

async function deleteNotifications(req, context) {
  const authenticatedUserId = context.user.id;

  try {
    await Notification.deleteMany({ recipient: authenticatedUserId });
    return success({});
  } catch (err) {
    return serverError('Failed to delete notifications', err);
  }
}

export const DELETE = withAuth(deleteNotifications);
