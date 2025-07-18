import Notification from '../api/models/Notifications';
import Entry from '../api/models/Entry';
import dbConnect from '@/utils/dbConnects';

export async function createNotification(entryId, actorId, type, actorType) {
  const entry = await Entry.findById(entryId).lean();

  if (!entry) throw new Error('Entry not found');

  const recipientId = entry.participant;

  if (String(recipientId) === String(actorId)) return;

  const newNotification = new Notification({
    recipient: recipientId,
    actor: actorId,
    actorType,
    entry: entryId,
    type,
  });

  return await newNotification.save();
}
