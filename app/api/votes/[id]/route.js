import dbConnect from '@/utils/dbConnects';
import Vote from '@/app/api/models/Vote';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import { isValidObjectId } from 'mongoose';

/* ───────── DELETE  /api/votes/[id] ───────── */
export async function DELETE(request) {
  /* 1️⃣  grab :id from URL before the first await */
  const { pathname } = new URL(request.url);
  const voteId = pathname.split('/').pop();

  if (!isValidObjectId(voteId)) {
    return Response.json({ error: 'Bad id' }, { status: 400 });
  }

  /* 2️⃣  auth */
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let participantId;
  try {
    participantId = verifyToken(token).id;
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  /* 3️⃣  DB */
  await dbConnect();

  const vote = await Vote.findById(voteId);
  if (!vote) return Response.json({ error: 'Vote not found' }, { status: 404 });
  if (vote.participant.toString() !== participantId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  await Vote.deleteOne({ _id: voteId });
  return new Response(null, { status: 204 });
}
