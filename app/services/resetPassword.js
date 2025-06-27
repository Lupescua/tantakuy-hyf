import Participant from '../api/models/Participant';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const DOMAIN = process.env.DOMAIN;

export async function resetPassword(forgotObj = {}) {
  const { email, newPassword } = forgotObj;
  console.log(forgotObj, 'forgotObj');
  if (!newPassword) {
    throw new Error('Missing required fields');
  }
  try {
    const user = await Participant.findOne({
      resetToken: req.query.token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token Expired!');
    }

    await Participant.updateOne({ email }, { $set: { password: newPassword } });

    return { user: { email: user.email, userName: user.userName } };
  } catch (error) {
    throw new Error(error.message || 'Password Reset Failed!');
  }
}
