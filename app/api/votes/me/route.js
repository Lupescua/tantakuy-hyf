import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
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
  const countResult = await countVotesForEntry({ entryId });
  if (!countResult.success) {
    return Response.json(
      { success: false, message: 'Could not count votes' },
      { status: 500 },
    );
  }

  // try to read token cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    // guest: total votes only
    return Response.json(
      {
        success: true,
        votes: countResult.data,
        hasVoted: false,
      },
      { status: 200 },
    );
  }

  // decode
  let participantId;
  try {
    const decoded = verifyToken(token);
    participantId = decoded.id;
  } catch {
    // invalid token: treat as guest
    return Response.json(
      {
        success: true,
        votes: countResult.data,
        hasVoted: false,
      },
      { status: 200 },
    );
  }

  // fetch user vote
  const userVote = await getUserVoteForEntry({ entryId, participantId });
  if (!userVote.success) {
    return Response.json(
      { success: false, message: 'Could not load user vote' },
      { status: 500 },
    );
  }

  return Response.json(
    {
      success: true,
      votes: countResult.data,
      hasVoted: userVote.hasVoted,
      recordId: userVote.recordId || null,
    },
    { status: 200 },
  );
}
