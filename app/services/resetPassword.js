import Participant from '../api/models/Participant';
import bcrypt from 'bcryptjs';
import { AppError } from '@/utils/errorHandler';

export async function resetPassword(forgotObj = {}) {
  const { email, newPassword, token } = forgotObj;

  if (!email || !newPassword || !token) {
    throw new AppError('Missing required fields.', 400);
  }

  try {
    const user = await Participant.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Reset token is invalid or has expired.', 410);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return {
      user: {
        email: user.email,
        userName: user.userName,
      },
    };
  } catch (error) {
    throw new AppError(error.message || 'Password reset failed!', 500);
  }
}
