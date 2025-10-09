import { withAuth } from '@/utils/authMiddleware';
import { success, badRequest, forbidden, notFound } from '@/utils/apiResponse';
import mongoose from 'mongoose';
import Entry from '@/app/api/models/Entry';
import Competition from '@/app/api/models/Competition';
import Vote from '@/app/api/models/Vote';
import { createNotification } from '@/app/services/notificationServices';
import { isValidObjectId } from 'mongoose';

async function drawWinner(request, context) {
  // 1) Grab and validate compId
  const { id: compId } = await context.params;
  if (!isValidObjectId(compId)) {
    return badRequest('Invalid competition ID');
  }

  // 2) Get user from withAuth
  const { id: actorId, role } = context.user;
  if (role !== 'company') {
    return forbidden('Only companies can draw winners');
  }

  // 3) Parse selection method
  const { method } = await request.json();
  let winnerEntry = null;

  // 4) Load all entries
  const entries = await Entry.find({ competition: compId }).lean();
  if (entries.length === 0) {
    return notFound('No entries found');
  }

  // 5) Pick based on method
  if (method === 'random') {
    const [picked] = await Entry.aggregate([
      { $match: { competition: new mongoose.Types.ObjectId(compId) } },
      { $sample: { size: 1 } },
    ]);
    winnerEntry = picked && (await Entry.findById(picked._id).lean());
  } else if (method === 'shares') {
    // we can reduce in JS since shares lives on Entry
    const best = entries.reduce(
      (max, e) => ((e.shares ?? 0) > (max.shares ?? 0) ? e : max),
      entries[0],
    );
    winnerEntry = await Entry.findById(best._id).lean();
  } else if (method === 'likes') {
    // aggregate vote‐counts
    const top = await Vote.aggregate([
      { $match: { entry: { $in: entries.map((e) => e._id) } } },
      { $group: { _id: '$entry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    if (top.length) {
      winnerEntry = await Entry.findById(top[0]._id).lean();
    }
  }

  if (!winnerEntry) {
    return notFound('No entries found');
  }

  // 6) Persist to competition
  await Competition.findByIdAndUpdate(
    compId,
    { winner: winnerEntry._id, winnerMethod: method },
    { new: true },
  );

  // 7) Notify the winner
  await createNotification(
    winnerEntry._id,
    actorId,
    'win',
    role === 'company' ? 'Company' : 'Participant',
  );

  // 8) Return the winner payload
  return success({
    winner: {
      id: winnerEntry._id.toString(),
      url: `/entry/${winnerEntry._id}`,
      method,
    },
  });
}

export const POST = withAuth(drawWinner);
