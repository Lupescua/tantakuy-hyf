import Entry from '../api/models/Entry';
import Vote from '../api/models/Vote';
import Competition from '../api/models/Competition';
import Company from '../api/models/Company';
import mongoose from 'mongoose';

export async function getUserCompetitionStats(userId) {
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

  const stats = await Promise.all(
    entries
      .filter((entry) => entry.competition)
      .map(async (entry) => {
        try {
          const likes = await Vote.countDocuments({ entry: entry._id });
          return {
            id: entry.competition?._id || '',
            title: entry.competition?.title || 'Unknown',
            organizer: entry.competition?.company?.name || 'Unknown',
            likes,
            shares: 0,
            saved: 0,
          };
        } catch (err) {
          console.error('Vote count failed for entry:', entry._id, err);
          return null; // Prevent Promise.all from failing
        }
      }),
  );

  return stats.filter(Boolean); // Remove nulls
}
