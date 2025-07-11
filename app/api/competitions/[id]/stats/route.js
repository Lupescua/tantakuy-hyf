import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import mongoose from 'mongoose';
import Entry from '@/app/api/models/Entry';
import Vote from '@/app/api/models/Vote';
import Competition from '@/app/api/models/Competition';
import { isValidObjectId } from 'mongoose';

export async function GET(request, context) {
  // Await params to conform with Next.js dynamic API requirements
  const { id: compId } = await context.params;
  if (!isValidObjectId(compId)) {
    return NextResponse.json(
      { error: 'Invalid competition ID' },
      { status: 400 },
    );
  }

  await dbConnect();

  // 1) Participants = number of entries
  const participants = await Entry.countDocuments({ competition: compId });

  // 2) Votes = total votes for entries in this competition
  const entryIds = await Entry.find({ competition: compId }).distinct('_id');
  const votes = await Vote.countDocuments({ entry: { $in: entryIds } });

  // 3) Shares = sum of the 'shares' field on each entry
  const shareAgg = await Entry.aggregate([
    { $match: { competition: new mongoose.Types.ObjectId(compId) } },
    { $group: { _id: null, total: { $sum: '$shares' } } },
  ]);
  const shares = shareAgg[0]?.total || 0;

  // 4) Clicks = the competition's own clicks counter
  const compDoc = await Competition.findById(compId).select('clicks');
  const clicks = compDoc?.clicks || 0;

  return NextResponse.json({ participants, votes, shares, clicks });
}
