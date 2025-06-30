import { saveVote, countVotesForEntry } from '@/app/services/voteServices';
import { cookies } from 'next/headers';
import dbConnect from '@/utils/dbConnects';
import { verifyToken } from '@/utils/jwt';

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { entry, voteType } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const decoded = verifyToken(token);
    const participantId = decoded.id;

    const voteResult = await saveVote({
      entryId: entry,
      participantId,
      voteType,
    });

    if (!voteResult.success) {
      return new Response(
        JSON.stringify({ success: false, message: voteResult.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, vote: voteResult.data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('POST /api/votes error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const entryId = url.searchParams.get('entryId');

    if (!entryId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing entryId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await countVotesForEntry({ entryId });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, message: result.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, votes: result.data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET /api/votes error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}