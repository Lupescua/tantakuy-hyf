import { createParticipant } from '@/app/services/participantServices';
import dbConnect from '@/utils/dbConnects';

export async function POST(req, res) {
  try {
    await dbConnect();
    const body = await req.json();
    const participant = await createParticipant(body);

    return Response.json({ success: true, data: participant }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
