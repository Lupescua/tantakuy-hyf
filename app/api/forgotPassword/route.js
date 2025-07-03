import { resetPassword } from '@/app/services/resetPassword';
import dbConnect from '@/utils/dbConnects';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = await resetPassword(body);

    return Response.json({
      success: true,
      message: 'Password reset successful',
      user,
    });
  } catch (error) {
    console.error('Error resetting password:', error);

    return Response.json(
      {
        success: false,
        message: 'Failed to reset password',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
