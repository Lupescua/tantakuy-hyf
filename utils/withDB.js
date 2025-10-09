import dbConnect from './dbConnects';
import { NextResponse } from 'next/server';

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
    try {
      await dbConnect();
      return handler(req, context);
    } catch (err) {
      console.error('Unhandled error in route handler:', err);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
    }
  };
}
