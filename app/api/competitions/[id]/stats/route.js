import { withDB } from '@/utils/withDB';
import { success, badRequest } from '@/utils/apiResponse';
import mongoose from 'mongoose';
import Entry from '@/app/api/models/Entry';
import Vote from '@/app/api/models/Vote';
import Competition from '@/app/api/models/Competition';
import { isValidObjectId } from 'mongoose';

async function getCompetitionStats(request, context) {
  // Await params to conform with Next.js dynamic API requirements
  const { id: compId } = await context.params;
  if (!isValidObjectId(compId)) {
    return badRequest('Invalid competition ID');
  }

  // 1) Participants = number of entries
  const participants = await Entry.countDocuments({ competition: compId });

  // 2) Votes = total votes for entries in this competition
  const voteAgg = await Vote.aggregate([
    {
      $lookup: {
        from: 'entries',
        localField: 'entry',
        foreignField: '_id',
        as: 'entryDoc',
      },
    },
    { $unwind: '$entryDoc' },
    {
      $match: { 'entryDoc.competition': new mongoose.Types.ObjectId(compId) },
    },
    { $count: 'total' },
  ]);
  const votes = voteAgg[0]?.total || 0;

  // 3) Shares = sum of the 'shares' field on each entry
  const shareAgg = await Entry.aggregate([
    { $match: { competition: new mongoose.Types.ObjectId(compId) } },
    { $group: { _id: null, total: { $sum: '$shares' } } },
  ]);
  const shares = shareAgg[0]?.total || 0;

  // 4) Clicks = the competition's own clicks counter
  const compDoc = await Competition.findById(compId).select('clicks');
  const clicks = compDoc?.clicks || 0;

  return success({ participants, votes, shares, clicks });
}

export const GET = withDB(getCompetitionStats);
