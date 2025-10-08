import { saveVote, countVotesForEntry } from '@/app/services/voteServices';
import { getUserFromCookie } from '@/utils/server/auth';
import { withAuth } from '@/utils/authMiddleware';
import Vote from '../models/Vote';
import { withDB } from '@/utils/withDB';

async function createVote(req, context) {
  try {
    const { entry, voteType } = await req.json();
    const participantId = context.user.id;

    const result = await saveVote({
      entryId: entry,
      participantId,
      voteType,
    });

    if (!result.ok) {
      if (result.reason === 'duplicate') {
        // client already has a vote – return 409
        return Response.json(
          { success: false, message: 'Already voted' },
          { status: 409 },
        );
      }
      return Response.json(
        { success: false, message: 'Could not save vote' },
        { status: 500 },
      );
    }

    return Response.json({ success: true, vote: result.vote }, { status: 201 });
  } catch (error) {
    console.error('POST /api/votes error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

export const POST = withAuth(createVote);

async function getVotes(req) {
  // extract entryId from query string
  const { searchParams } = new URL(req.url);
  const entryId = searchParams.get('entryId');
  if (!entryId) {
    return Response.json(
      { success: false, message: 'Missing entryId' },
      { status: 400 },
    );
  }

  // 1) Count total votes
  const countResult = await countVotesForEntry({ entryId });
  if (!countResult.success) {
    return Response.json(
      { success: false, message: countResult.message },
      { status: 400 },
    );
  }

  // 2) Check whether *this* user has voted
  let userVoted = false;
  const user = await getUserFromCookie();
  if (user) {
    const existing = await Vote.findOne({
      entry: entryId,
      participant: user.id,
    });
    userVoted = !!existing;
  }

  return Response.json(
    { success: true, votes: countResult.data, userVoted },
    { status: 200 },
  );
}

export const GET = withDB(getVotes);
