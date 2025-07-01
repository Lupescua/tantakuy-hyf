import dbConnect from '@/utils/dbConnects';
import Participant from '../api/models/Participant';
import crypto from 'crypto';
import { AppError } from '@/utils/errorHandler';

const DOMAIN = process.env.DOMAIN;

export async function sendResetLink(email) {
  await dbConnect();

  if (!email) {
    throw new AppError('Email is required.', 400);
  }

  try {
    const user = await Participant.findOne({ email });
    console.log(user);
    if (!user) {
      throw new AppError('No user found with that email.', 404);
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `${DOMAIN}forgot-password?step=reset&token=${token}&email=${email}`;
    return resetLink;
  } catch (error) {
    throw new AppError(error.message || 'Password Reset Failed!', 500);
  }
}
