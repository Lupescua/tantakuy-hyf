import { withDB } from '@/utils/withDB';
import Participant from '@/app/api/models/Participant';
import { AppError } from '@/utils/errorHandler';
import Company from '../models/Company';
import { createRateLimiter, checkRateLimit } from '@/utils/rateLimit';
import { badRequest, success } from '@/utils/apiResponse';

const ratelimit = createRateLimiter(5, '15 m');

async function forgotPasswordHandler(request) {
  const rateLimitResponse = await checkRateLimit(
    request,
    'forgotpw',
    ratelimit,
  );
  if (rateLimitResponse) return rateLimitResponse;
  const { email, newPassword, token } = await request.json();

  if (!email || !newPassword || !token) {
    throw new AppError('Missing parameters', 400);
  }

  // 1) find the user whose resetToken matches & hasn't expired
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
    return badRequest('Invalid or expired token');
  }

  // 2) overwrite the password, clear the reset fields
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  // 3) .save() so your pre('save') hashing runs
  await user.save();

  return success({ message: 'Password reset' });
}

export const POST = withDB(forgotPasswordHandler);
