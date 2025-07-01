import { getUserFromCookie } from './server/auth';
import dbConnect from './dbConnects';

export function withAuth(handler) {
  return async function (req, context) {
    await dbConnect();

    const user = getUserFromCookie(req);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    return handler(req, { ...context, user });
  };
}
