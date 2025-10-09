import { loginUser } from '@/app/services/loginServices';
import { cookies } from 'next/headers';
import { createRateLimiter, checkRateLimit } from '@/utils/rateLimit';
import { withDB } from '@/utils/withDB';
import { success, unauthorized } from '@/utils/apiResponse';

const ratelimit = createRateLimiter(5, '15 m');

async function loginHandler(req) {
  const rateLimitResponse = await checkRateLimit(
    req,
    'login',
    ratelimit,
    'Too many login attempts. Please try again later.',
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const { token, user } = await loginUser(body);
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return success({ user, message: 'logged in' });
  } catch (error) {
    return unauthorized(error.message);
  }
}

export const POST = withDB(loginHandler);
