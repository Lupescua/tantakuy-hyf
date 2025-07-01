import { validateToken } from '@/app/services/tokenValidationService';
import { AppError } from '@/utils/errorHandler';

export async function POST(req) {
  try {
    const { token, email } = await req.json();
    const res = await validateToken(email, token);
    if (res.success) {
      return Response.json({ success: true, message: 'Valid' });
    } else {
      return Response.json({ success: false, message: 'Invalid' });
    }
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
