import { loginUser } from '@/app/services/loginServices';
import dbConnect from '@/utils/dbConnects';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    // console.log('[API/login] incoming body →');
    const body = await req.json();
    // console.log(body); were used for debugging only
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
        user, //maybe we should detail that it include id, email, userName and role, if there are issues later
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
