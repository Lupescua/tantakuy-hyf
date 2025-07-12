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
    const { id, role } = verifyToken(token);
    await dbConnect();
    // const user = await Participant.findById(id).select('userName email');
    let user;
    if (role === 'participant') {
      user = await Participant.findById(id).select('userName email');
    } else if (role === 'company') {
      // company model:
      const Company = (await import('../../models/Company')).default;
      user = await Company.findById(id).select('companyName email');
    } else if (role === 'organization') {
   
      user = await Participant.findById(id).select('userName email');
    } else {
     
      user = await Participant.findById(id).select('userName email');
    }

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
    return Response.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          userName: user.userName ?? user.companyName,
          role,
        },
      },
      { status: 200 },
    );
  } catch {
    return Response.json({ success: false }, { status: 200 });
  }
}
