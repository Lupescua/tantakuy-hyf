import { createParticipant } from '@/app/services/participantServices';
import { cookies } from 'next/headers';
import { withDB } from '@/utils/withDB';

async function createParticipantHandler(req) {
  try {
    const body = await req.json();
    const { participant, token } = await createParticipant(body);

    return Response.json({ success: true, data: participant }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

export const POST = withDB(createParticipantHandler);
