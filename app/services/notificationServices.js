import Notification from '../api/models/Notifications';
import Entry from '../api/models/Entry';
import dbConnect from '@/utils/dbConnects';

export async function createNotification(entryId, actorId, type) {
  const entry = await Entry.findById(entryId).lean();
  console.log('it is creating votes');
  if (!entry) throw new Error('Entry not found');

  const recipientId = entry.participant;

  if (String(recipientId) === String(actorId)) return;

  const newNotification = new Notification({
    recipient: recipientId,
    actor: actorId,
    entry: entryId,
    type,
  });

  return await newNotification.save();
}
