import { getUserFromCookie } from '@/utils/server/auth';
import { withDB } from '@/utils/withDB';
import { success } from '@/utils/apiResponse';
import Participant from '../../models/Participant';

async function getCurrentUser() {
  // Get user from cookie
  const userFromCookie = await getUserFromCookie();

  // No token or invalid -> guest
  if (!userFromCookie) {
    return success({ user: null });
  }

  try {
    const { id, role } = userFromCookie;

    let user;
    if (role === 'participant') {
      user = await Participant.findById(id).select('userName email');
    } else {
      // company model:
      const Company = (await import('../../models/Company')).default;
      user = await Company.findById(id).select('companyName email');
    }

    // User might have been deleted
    if (!user) {
      return success({ user: null });
    }

    return success({
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName ?? user.companyName,
        role,
      },
    });
  } catch {
    return success({ user: null });
  }
}

export const GET = withDB(getCurrentUser);
