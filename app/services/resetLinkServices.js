import dbConnect from '@/utils/dbConnects';
import Participant from '../api/models/Participant';
import Company from '../api/models/Company';
import crypto from 'crypto';
import { AppError } from '@/utils/errorHandler';

const rawDomain = process.env.DOMAIN;
if (!rawDomain) {
  throw new Error(
    'Missing DOMAIN env var – set DOMAIN=http://localhost:3000 (and in prod to your live URL)',
  );
}
// ensure we don’t accidentally drop or double up the slash:
const DOMAIN = rawDomain.endsWith('/') ? rawDomain.slice(0, -1) : rawDomain;

export async function sendResetLink(email) {
  await dbConnect();

  if (!email) {
    throw new AppError('Email is required.', 400);
  }

  try {
    let user = await Participant.findOne({ email });
    let userType = 'participant';

    if (!user) {
      user = await Company.findOne({ email });
      userType = 'company';
    }

    if (!user) {
      throw new AppError('No user found with that email.', 404);
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `${DOMAIN}/forgot-password?step=reset&token=${token}&email=${encodeURIComponent(email)}`;
    return resetLink;
  } catch (error) {
    throw new AppError(error.message || 'Password Reset Failed!', 500);
  }
}
