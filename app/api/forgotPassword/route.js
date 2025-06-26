import { resetPassword } from '@/app/services/resetPassword';
import dbConnect from '@/utils/dbConnects';
import { sendResetLink } from '@/app/services/resetLinkServices';


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body)
    const user = await resetPassword(body);

    return Response.json({
      success: true,
      user,
    },
      { status: 200 });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    }, { status: 401 });
  }
}
