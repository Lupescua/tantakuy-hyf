import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt.js';
import dbConnect from '@/utils/dbConnects';
import mongoose from 'mongoose';
import Entry from '@/app/api/models/Entry';
import Competition from '@/app/api/models/Competition';
import Vote from '@/app/api/models/Vote';
import { createNotification } from '@/app/services/notificationServices';
import { isValidObjectId } from 'mongoose';
import { cookies } from 'next/headers';

export async function POST(request, context) {
  // 1) Grab and validate compId
  const { id: compId } = await context.params;
  if (!isValidObjectId(compId)) {
    return NextResponse.json(
      { error: 'Invalid competition ID' },
      { status: 400 },
    );
  }
  await dbConnect();

  // 2) Authenticate via token cookie
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: actorId, role } = payload;
  if (role !== 'company') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3) Parse selection method
  const { method } = await request.json();
  let winnerEntry = null;

  // 4) Load all entries
  const entries = await Entry.find({ competition: compId }).lean();
  if (entries.length === 0) {
    return NextResponse.json({ error: 'No entries found' }, { status: 404 });
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
    return NextResponse.json({ error: 'No entries found' }, { status: 404 });
  }

  // 6) Persist to competition
  await Competition.findByIdAndUpdate(
    compId,
    { winner: winnerEntry._id, winnerMethod: method },
    { new: true },
  );

  // 7) Notify the winner
  await createNotification(winnerEntry._id, actorId, 'win');

  // 8) Return the winner payload
  return NextResponse.json(
    {
      success: true,
      winner: {
        id: winnerEntry._id.toString(),
        url: `/entry/${winnerEntry._id}`,
        method,
      },
    },
    { status: 200 },
  );
}
