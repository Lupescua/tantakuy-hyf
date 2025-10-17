/**
 * Standardized API Response Utilities
 *
 * Provides consistent response formatting across all API routes
 *
 * @example
 * // Success with data
 * return success({ users: [...] })
 *
 * // Success with custom message
 * return success({ message: 'Email sent' })
 *
 * // Error response
 * return error('User not found', 404)
 *
 * // No content (delete)
 * return noContent()
 */

import { NextResponse } from 'next/server';

/**
 * Returns a successful JSON response
 * @param {object} data - The data to return
 * @param {number} [status=200] - HTTP status code (default: 200)
 * @returns {NextResponse}
 */
export function success(data, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

/**
 * Returns a successful response for POST/create operations
 * @param {object} data - The created resource
 * @returns {NextResponse}
 */
export function created(data) {
  return success(data, 201);
}

/**
 * Returns a 204 No Content response (typically for DELETE)
 * @returns {NextResponse}
 */
export function noContent() {
  return new NextResponse(null, { status: 204 });
}

/**
 * Returns an error JSON response
 * @param {string} message - Error message
 * @param {number} [status=500] - HTTP status code (default: 500)
 * @param {object} [details=null] - Optional additional error details
 * @returns {NextResponse}
 */
export function error(message, status = 500, details = null) {
  const response = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Returns a 400 Bad Request error
 * @param {string} message - Error message
 * @param {object} [details=null] - Optional validation details
 * @returns {NextResponse}
 */
export function badRequest(message, details = null) {
  return error(message, 400, details);
}

/**
 * Returns a 401 Unauthorized error
 * @param {string} [message='Unauthorized'] - Error message
 * @returns {NextResponse}
 */
export function unauthorized(message = 'Unauthorized') {
  return error(message, 401);
}

/**
 * Returns a 403 Forbidden error
 * @param {string} [message='Forbidden'] - Error message
 * @returns {NextResponse}
 */
export function forbidden(message = 'Forbidden') {
  return error(message, 403);
}

/**
 * Returns a 404 Not Found error
 * @param {string} [message='Not found'] - Error message
 * @returns {NextResponse}
 */
export function notFound(message = 'Not found') {
  return error(message, 404);
}

/**
 * Returns a 409 Conflict error
 * @param {string} message - Error message
 * @returns {NextResponse}
 */
export function conflict(message) {
  return error(message, 409);
}

/**
 * Returns a 500 Internal Server Error
 * @param {string} [message='Internal server error'] - Error message
 * @param {Error} [err=null] - Optional error object for logging
 * @returns {NextResponse}
 */
export function serverError(message = 'Internal server error', err = null) {
  if (err) {
    console.error('Server Error:', err);
  }
  return error(message, 500);
}

/**
 * Returns a 503 Service Unavailable error
 * @param {string} [message='Service temporarily unavailable'] - Error message
 * @returns {NextResponse}
 */
export function serviceUnavailable(
  message = 'Service temporarily unavailable',
) {
  return error(message, 503);
}
