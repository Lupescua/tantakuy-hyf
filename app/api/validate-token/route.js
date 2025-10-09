import { validateToken } from '@/app/services/tokenValidationService';
import { AppError } from '@/utils/errorHandler';
import { badRequest, serverError, success } from '@/utils/apiResponse';

export async function POST(req) {
  try {
    const { token, email } = await req.json();
    if (!email || !token) {
      return badRequest('Missing email or token');
    }
    const result = await validateToken(email, token);
    return success(result);
  } catch (err) {
    return serverError('Server error', err);
  }
}
