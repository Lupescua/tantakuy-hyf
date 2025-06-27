import Vote from '../api/models/Vote';
import dbConnect from '@/utils/dbConnects';
import { getUserFromToken } from '@/utils/jwt';

export const saveVote = async ({ entryId, participantId, voteType }) => {
  if (!entryId || !participantId || !voteType) {
    return { success: false, message: 'Missing required fields' };
  }
  try {
    const vote = await Vote.create({
      entry: entryId,
      participant: participantId,
      voteType,
    });
    return { success: true, data: vote };
  } catch (error) {
    return { success: false, message: "Couldn't save the vote" };
  }
};

export const countVotesForEntry = async ({ entryId }) => {
  if (!entryId) {
    return { success: false, message: 'Missing required fields' };
  }
  try {
    const voteCount = await Vote.countDocuments({ entry: entryId }).populate(
      'entry',
      'title',
    );
    return { success: true, data: voteCount };
  } catch (error) {
    return { success: false, message: "Couldn't count the votes" };
  }
};
