import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Participant from '@/app/api/models/Participant';
import { AppError } from '@/utils/errorHandler';

export async function POST(request) {
  await dbConnect();
  const { email, newPassword, token } = await request.json();

  if (!email || !newPassword || !token) {
    throw new AppError('Missing parameters', 400);
  }

  // 1) find the user whose resetToken matches & hasn’t expired
  const user = await Participant.findOne({
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
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
