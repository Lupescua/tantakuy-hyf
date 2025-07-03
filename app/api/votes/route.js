import { saveVote, countVotesForEntry } from '@/app/services/voteServices';
import dbConnect from '@/utils/dbConnects';
import { getUserFromCookie } from '@/utils/server/auth'; // or correct path

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { entry, voteType } = body;

    const user = await getUserFromCookie();
    if (!user) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const participantId = user.id;

    const voteResult = await saveVote({
      entryId: entry,
      participantId: participantId,
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
    console.error('POST /api/vote error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get('entryId');
    if (!entryId) {
      return Response.json(
        { success: false, message: 'Missing entryId' },
        { status: 400 },
      );
    }

    const result = await countVotesForEntry({ entryId });

    if (!result.success) {
      return Response.json(
        { success: false, message: result.message },
        { status: 400 },
      );
    }

    return Response.json(
      { success: true, votes: result.data },
      { status: 200 },
    );
  } catch (error) {
    console.error('GET /api/vote error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
