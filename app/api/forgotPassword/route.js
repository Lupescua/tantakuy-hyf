import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Participant from '@/app/api/models/Participant';
import { AppError } from '@/utils/errorHandler';
import Company from '../models/Company';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
});

export async function POST(request) {
  const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(`forgotpw:${identifier}`);

  if (!success) {
    return NextResponse.json(
      { success: false, message: 'Too many attempts. Please try again later.' },
      { status: 429 },
    );
  }

  await dbConnect();
  const { email, newPassword, token } = await request.json();

  if (!email || !newPassword || !token) {
    throw new AppError('Missing parameters', 400);
  }

  // 1) find the user whose resetToken matches & hasn’t expired
  let user = await Participant.findOne({
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    user = await Company.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
  }
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 400 },
    );
  }

  // 2) overwrite the password, clear the reset fields
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  // 3) .save() so your pre('save') hashing runs
  await user.save();

  return NextResponse.json({ success: true, message: 'Password reset' });
}
