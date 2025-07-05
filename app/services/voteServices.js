import Vote from '@/app/api/models/Vote';
import dbConnect from '@/utils/dbConnects';
import { AppError } from '@/utils/errorHandler';
import { createNotification } from './notificationServices';

export async function countVotesForEntry({ entryId }) {
  if (!entryId) {
    throw new AppError('Missing entryId', 400);
  }
  await dbConnect();
  const count = await Vote.countDocuments({ entry: entryId });
  return count;
}

export async function getUserVoteForEntry({ entryId, participantId }) {
  if (!entryId || !participantId) {
    return { hasVoted: false, recordId: null };
  }
  await dbConnect();
  const vote = await Vote.findOne({
    entry: entryId,
    participant: participantId,
  });
  return vote
    ? { hasVoted: true, recordId: vote._id.toString() }
    : { hasVoted: false, recordId: null };
}

export async function saveVote({ entryId, participantId, voteType }) {

  if (!entryId || !participantId || !voteType) {
    throw new AppError('Missing required fields', 400);
  }

  await dbConnect();
  try {
    const vote = await Vote.create({
      entry: entryId,
      participant: participantId,
      voteType,
    });
    await createNotification(entryId, participantId, 'like');
   
    return { ok: true, vote };
  } catch (error) {
    console.error('Vote creation error:', error);
  
    if (error.code === 11000) {
      return { ok: false, reason: 'duplicate' };
    }
  
    throw new AppError("Couldn't save the vote", 500);
  }
}

export async function deleteVoteById({ voteId, participantId }) {
  if (!voteId || !participantId) {
    throw new AppError('Missing required fields', 400);
  }
  await dbConnect();
  const vote = await Vote.findById(voteId);
  if (!vote) throw new AppError('Vote not found', 404);
  if (vote.participant.toString() !== participantId)
    throw new AppError('Forbidden', 403);
  await Vote.deleteOne({ _id: voteId });
  await createNotification(entryId, userId, 'dislike');
}
