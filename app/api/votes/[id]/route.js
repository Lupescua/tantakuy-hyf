import { withAuth } from '@/utils/authMiddleware';
import {
  badRequest,
  notFound,
  forbidden,
  noContent,
} from '@/utils/apiResponse';
import Vote from '@/app/api/models/Vote';
import { isValidObjectId } from 'mongoose';

/* ───────── DELETE  /api/votes/[id] ───────── */
async function deleteVote(request, context) {
  /* 1️⃣  grab :id from URL before the first await */
  const { pathname } = new URL(request.url);
  const voteId = pathname.split('/').pop();

  if (!isValidObjectId(voteId)) {
    return badRequest('Invalid vote ID');
  }

  /* 2️⃣  get user from withAuth */
  const participantId = context.user.id;

  /* 3️⃣  DB */
  const vote = await Vote.findById(voteId);
  if (!vote) return notFound('Vote not found');
  if (vote.participant.toString() !== participantId) {
    return forbidden('You can only delete your own votes');
  }

  await Vote.deleteOne({ _id: voteId });
  return noContent();
}

export const DELETE = withAuth(deleteVote);
