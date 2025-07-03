import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt.js';
import dbConnect from '@/utils/dbConnects';
import Participant from '../../models/Participant';

export async function GET() {
  //read cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  //no token -> guest
  if (!token) {
    return Response.json({ success: false, user: null }, { status: 200 });
  }
  try {
    //verify & load lightweight user info
    const { id } = verifyToken(token);
    await dbConnect();
    const user = await Participant.findById(id).select('userName email');

    //user might have been deleted
    if (!user) {
      return Response.json(
        {
          success: false,
          user: null,
        },
        {
          status: 200,
        },
      );
    }
    return Response.json({ success: true, user }, { status: 200 });
  } catch {
    return Response.json({ success: false }, { status: 200 });
  }
}
