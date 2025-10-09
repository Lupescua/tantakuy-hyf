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
    // Handle DB connection separately
    try {
      await dbConnect();
    } catch (err) {
      console.error('Database connection failed:', err);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 },
      );
    }

    // Let handler manage its own errors
    return handler(req, context);
  };
}
