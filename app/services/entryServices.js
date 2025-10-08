import Entry from '../api/models/Entry';
import Vote from '../api/models/Vote';
import Competition from '../api/models/Competition';
import Company from '../api/models/Company';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnects';

export async function getUserCompetitionStats(userId) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const entries = await Entry.find({ participant: userId })
    .populate({
      path: 'competition',
      populate: { path: 'company', model: 'Company' },
    })
    .lean();

  if (!entries.length) {
    return null;
  }

  const filteredEntries = entries.filter((entry) => entry.competition);

  // Count votes for all entries in a single aggregation query
  const entryIds = filteredEntries.map((entry) => entry._id);
  const voteCounts = await Vote.aggregate([
    { $match: { entry: { $in: entryIds } } },
    { $group: { _id: '$entry', count: { $sum: 1 } } },
  ]);

  // Create a map for O(1) lookup
  const voteMap = {};
  voteCounts.forEach((v) => {
    voteMap[v._id.toString()] = v.count;
  });

  // Map entries to stats without additional queries
  const stats = filteredEntries.map((entry) => ({
    id: entry.competition?._id || '',
    title: entry.competition?.title || 'Unknown',
    organizer: entry.competition?.company?.name || 'Unknown',
    likes: voteMap[entry._id.toString()] || 0,
    shares: 0,
    saved: 0,
    imageUrl: entry.imageUrl,
  }));

  return stats;
}
