import dbConnect from '@/utils/dbConnects';
import { success, serverError } from '@/utils/apiResponse';

export async function GET() {
  try {
    await dbConnect();
    return success({ connected: true });
  } catch (err) {
    return serverError('Database connection failed', err);
  }
}
