import { loginUser } from '@/app/services/loginServices';
import dbConnect from '@/utils/dbConnects';
import { cookies } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
});

export async function POST(req) {
  const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(`login:${identifier}`);

  if (!success) {
    return Response.json(
      {
        success: false,
        message: 'Too many login attempts. Please try again later.',
      },
      { status: 429 },
    );
  }

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
