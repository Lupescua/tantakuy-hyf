import { createParticipant } from '@/app/services/participantServices';
import { withDB } from '@/utils/withDB';
import { created, badRequest } from '@/utils/apiResponse';

async function createParticipantHandler(req) {
  try {
    const body = await req.json();
    const { participant, token } = await createParticipant(body);

    return created({ participant });
  } catch (error) {
    return badRequest(error.message);
  }
}

export const POST = withDB(createParticipantHandler);
