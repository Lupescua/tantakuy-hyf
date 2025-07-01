import { saveVote, countVotesForEntry } from '@/app/services/voteServices';
import dbConnect from '@/utils/dbConnects';
import { verifyToken } from '@/utils/jwt';
import Vote from '../models/Vote';

export async function POST(req) {
  await dbConnect();

  try {
    const { entry, voteType } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id: participantId } = verifyToken(token);

    const voteResult = await saveVote({
      entryId: entry,
      participantId,
      voteType,
    });

    if (!voteResult.success) {
      return Response.json(
        { success: false, message: voteResult.message },
        { status: 400 },
      );
    }

    return Response.json(
      { success: true, vote: voteResult.data },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/votes error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  await dbConnect();

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
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
      const { id: participantId } = verifyToken(token);
      const existing = await Vote.findOne({
        entry: entryId,
        participant: participantId,
      });
      userVoted = !!existing;
    }
  } catch {
    // if no token or invalid, just leave userVoted=false
  }

  return Response.json(
    { success: true, votes: countResult.data, userVoted },
    { status: 200 },
  );
}
