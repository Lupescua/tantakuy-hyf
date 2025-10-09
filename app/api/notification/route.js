import Notification from '../models/Notifications';
import Entry from '../models/Entry';
import Participant from '../models/Participant';
import Company from '../models/Company';
import Competition from '../models/Competition';
import { withDB } from '@/utils/withDB';
import { badRequest, serverError, success } from '@/utils/apiResponse';

async function getNotifications(req) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return badRequest('Missing userId');
  }

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

export const GET = withDB(getNotifications);

async function deleteNotifications(req) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return badRequest('Missing userId');
  }

  try {
    await Notification.deleteMany({ recipient: userId });
    return success({});
  } catch (err) {
    return serverError(err.message, err);
  }
}

export const DELETE = withDB(deleteNotifications);
