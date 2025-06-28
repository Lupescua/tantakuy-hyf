import { loginUser } from '@/app/services/loginServices';
import dbConnect from '@/utils/dbConnects';
import { cookies } from 'next/headers';

export async function Post(req) {
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
        user: {
          email: user.email,
          userName: user.userName,
        },
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
