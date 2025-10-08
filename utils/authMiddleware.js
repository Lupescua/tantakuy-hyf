import { getUserFromCookie } from './server/auth';
import { withDB } from './withDB';

/**
 * Higher-order function that adds authentication to a route handler
 * Combines authentication check with automatic DB connection
 *
 * @param {Function} handler - The API route handler function
 * @returns {Function} Wrapped handler with auth and DB connection
 *
 * @example
 * export const POST = withAuth(async (req, { user }) => {
 *   // user is automatically available here
 *   // DB is already connected
 *   return NextResponse.json({ userId: user.id });
 * });
 */
function authHandler(handler) {
  return async function (req, context) {
    const user = await getUserFromCookie(req);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    return handler(req, { ...context, user });
  };
}

/**
 * Combines withDB and authentication
 * Use this for routes that require both DB connection and user authentication
 */
export function withAuth(handler) {
  return withDB(authHandler(handler));
}
