import { getUserFromCookie } from '@/utils/server/auth';
import {
  countVotesForEntry,
  getUserVoteForEntry,
} from '@/app/services/voteServices';

export async function GET(request) {
  // make sure they passed entryId
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entryId');
  if (!entryId) {
    return Response.json(
      { success: false, message: 'Missing entryId' },
      { status: 400 },
    );
  }

  // total votes
  let votes;
  try {
    votes = await countVotesForEntry({ entryId }); // returns a NUMBER
  } catch (err) {
    console.error('countVotesForEntry failed:', err);
    return Response.json(
      { success: false, message: err.message || 'Could not count votes' },
      { status: err.statusCode || 500 },
    );
  }

  // try to get user from cookie
  const user = await getUserFromCookie();
  if (!user) {
    // guest: total votes only
    return Response.json(
      {
        success: true,
        votes,
        hasVoted: false,
      },
      { status: 200 },
    );
  }

  const participantId = user.id;

  // fetch user vote
  let hasVoted = false;
  let recordId = null;
  try {
    const res = await getUserVoteForEntry({ entryId, participantId });
    hasVoted = res.hasVoted;
    recordId = res.recordId;
  } catch (err) {
    console.error('getUserVoteForEntry failed:', err);
    // still return at least the total votes
    return Response.json(
      { success: false, message: err.message || 'Could not load user vote' },
      { status: err.statusCode || 500 },
    );
  }

  return Response.json(
    {
      success: true,
      votes,
      hasVoted,
      recordId,
    },
    { status: 200 },
  );
}
