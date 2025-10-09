import { validateToken } from '@/app/services/tokenValidationService';
import { AppError } from '@/utils/errorHandler';
import { badRequest, serverError, success, unauthorized } from '@/utils/apiResponse';

export async function POST(req) {
  try {
    const { token, email } = await req.json();
    if (!email || !token) {
      return badRequest('Missing email or token');
    }
    const result = await validateToken(email, token);

    // Check if validation was successful
    if (!result.success) {
      return unauthorized(result.message);
    }

    // Return success with validation result
    return success({ message: result.message });
  } catch (err) {
    console.error('Error validating token:', err);
    return serverError('Server error', err);
  }
}
