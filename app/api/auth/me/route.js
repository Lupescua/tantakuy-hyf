import { getUserFromCookie } from '@/utils/server/auth';
import { withDB } from '@/utils/withDB';
import Participant from '../../models/Participant';

async function getCurrentUser() {
  // Get user from cookie
  const userFromCookie = await getUserFromCookie();

  // No token or invalid -> guest
  if (!userFromCookie) {
    return Response.json({ success: false, user: null }, { status: 200 });
  }

  try {
    const { id, role } = userFromCookie;

    // const user = await Participant.findById(id).select('userName email');
    let user;
    if (role === 'participant') {
      user = await Participant.findById(id).select('userName email');
    } else {
      // company model:
      const Company = (await import('../../models/Company')).default;
      user = await Company.findById(id).select('companyName email');
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

export const GET = withDB(getCurrentUser);
