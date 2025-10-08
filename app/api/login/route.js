import { loginUser } from '@/app/services/loginServices';
import dbConnect from '@/utils/dbConnects';
import { cookies } from 'next/headers';
import { createRateLimiter, checkRateLimit } from '@/utils/rateLimit';

const ratelimit = createRateLimiter(5, '15 m');

export async function POST(req) {
  const rateLimitResponse = await checkRateLimit(
    req,
    'login',
    ratelimit,
    'Too many login attempts. Please try again later.',
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await dbConnect();
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

    return Response.json(
      {
        success: true,
        user,
        message: 'logged in',
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 401 },
    );
  }
}
