import { withAuth } from '@/utils/authMiddleware';
import Vote from '@/app/api/models/Vote';
import { isValidObjectId } from 'mongoose';

/* ───────── DELETE  /api/votes/[id] ───────── */
async function deleteVote(request, context) {
  /* 1️⃣  grab :id from URL before the first await */
  const { pathname } = new URL(request.url);
  const voteId = pathname.split('/').pop();

  if (!isValidObjectId(voteId)) {
    return Response.json({ error: 'Bad id' }, { status: 400 });
  }

  /* 2️⃣  get user from withAuth */
  const participantId = context.user.id;

  /* 3️⃣  DB */
  const vote = await Vote.findById(voteId);
  if (!vote) return Response.json({ error: 'Vote not found' }, { status: 404 });
  if (vote.participant.toString() !== participantId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  await Vote.deleteOne({ _id: voteId });
  return new Response(null, { status: 204 });
}

export const DELETE = withAuth(deleteVote);
