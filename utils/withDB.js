import dbConnect from './dbConnects';

/**
 * Higher-order function that ensures database connection before executing handler
 * Eliminates the need to manually call dbConnect() in every API route
 *
 * @param {Function} handler - The API route handler function
 * @returns {Function} Wrapped handler with automatic DB connection
 *
 * @example
 * export const GET = withDB(async (req) => {
 *   // DB is already connected here
 *   const data = await Model.find();
 *   return NextResponse.json(data);
 * });
 */
export function withDB(handler) {
  return async (req, context) => {
    await dbConnect();
    return handler(req, context);
  };
}
