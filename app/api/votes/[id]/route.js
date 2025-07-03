import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import { deleteVoteById } from '@/app/services/voteServices';

export async function DELETE(request, { params }) {
  const voteId = params.id;
  if (!voteId) {
    return Response.json(
      {
        success: false,
        message: 'Missing vote ID',
      },
      {
        status: 400,
      },
    );
  }

  // 1️⃣ Auth
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return Response.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    );
  }

  let participantId;
  try {
    participantId = verifyToken(token).id;
  } catch {
    return Response.json(
      {
        success: false,
        message: 'Invalid token',
      },
      {
        status: 401,
      },
    );
  }

  // 2️⃣ Business logic
  try {
    await deleteVoteById({ voteId, participantId });
    // 204 no content
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
