import { getUserFromCookie } from '@/utils/server/auth';
import { badRequest, serverError, success } from '@/utils/apiResponse';
import {
  countVotesForEntry,
  getUserVoteForEntry,
} from '@/app/services/voteServices';

export async function GET(request) {
  // make sure they passed entryId
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entryId');
  if (!entryId) {
    return badRequest('Missing entryId');
  }

  // total votes
  let votes;
  try {
    votes = await countVotesForEntry({ entryId }); // returns a NUMBER
  } catch (err) {
    console.error('countVotesForEntry failed:', err);
    return serverError(err.message || 'Could not count votes', err);
  }

  // try to get user from cookie
  const user = await getUserFromCookie();
  if (!user) {
    // guest: total votes only
    return success({
      votes,
      hasVoted: false,
    });
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
    return serverError(err.message || 'Could not load user vote', err);
  }

  return success({
    votes,
    hasVoted,
    recordId,
  });
}
