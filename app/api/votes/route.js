import { saveVote, countVotesForEntry } from '@/app/services/voteServices';
import { getUserFromCookie } from '@/utils/server/auth';
import { withAuth } from '@/utils/authMiddleware';
import {
  created,
  conflict,
  serverError,
  success,
  badRequest,
} from '@/utils/apiResponse';
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
        return conflict('Already voted');
      }
      return serverError('Could not save vote');
    }

    return created({ vote: result.vote });
  } catch (error) {
    console.error('POST /api/votes error:', error);
    return serverError('Server error', error);
  }
}

export const POST = withAuth(createVote);

async function getVotes(req) {
  // extract entryId from query string
  const { searchParams } = new URL(req.url);
  const entryId = searchParams.get('entryId');
  if (!entryId) {
    return badRequest('Missing entryId');
  }

  // 1) Count total votes
  const countResult = await countVotesForEntry({ entryId });

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

  return success({ votes: countResult, userVoted });
}

export const GET = withDB(getVotes);
