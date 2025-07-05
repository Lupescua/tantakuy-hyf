import { createParticipant } from '@/app/services/participantServices';
import dbConnect from '@/utils/dbConnects';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { participant, token } = await createParticipant(body);
    // const cookieStore = await cookies();
    // cookieStore.set('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',     //this was causing a bug in the UI, so now we need users to login manually after registration
    //   sameSite: 'strict',
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 7,
    // });
    return Response.json({ success: true, data: participant }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
