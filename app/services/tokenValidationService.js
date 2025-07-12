import Participant from '../api/models/Participant';
import Company from '@/app/api/models/Company';
import dbConnect from '@/utils/dbConnects';

export const validateToken = async (email, token) => {
  await dbConnect();

  // look for a Participant whose resetToken matches and hasn't expired
  let user = await Participant.findOne({
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  // if not a participant, try Company
  if (!user) {
    user = await Company.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
  }

  if (!user) {
    return { success: false, message: 'Invalid or expired token' };
  }
  return { success: true, message: 'Valid token' };
};
