import { resetPassword } from '@/app/services/resetPassword';
import dbConnect from '@/utils/dbConnects';


export async function POST(req) {
  try {
    await dbConnect();

    console.log(req, "this is req")
    const body = await req.json();
    console.log(body)
    const user = await resetPassword(body);
    console.log(user.email, user.userName)
    

    return Response.json({
        success: true,
        user,},
        { status: 200 });
  
    } catch (error) {
      return Response.json({
        success: false,
        message: error.message,
      }, { status: 401 });
    }
  }
