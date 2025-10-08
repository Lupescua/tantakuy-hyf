import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Creates a rate limiter instance with specified configuration
 * @param {number} limit - Maximum number of requests allowed
 * @param {string} window - Time window (e.g., '15 m', '1 h')
 * @param {string} type - Type of limiter: 'sliding' or 'tokenBucket'
 * @param {number} refillRate - Refill rate for token bucket (optional)
 * @returns {Ratelimit} Configured rate limiter instance
 */
export function createRateLimiter(limit, window, type = 'sliding', refillRate) {
  const limiter =
    type === 'tokenBucket'
      ? Ratelimit.tokenBucket(limit, window, refillRate)
      : Ratelimit.slidingWindow(limit, window);

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter,
    analytics: true,
  });
}

/**
 * Checks rate limit for a given request and prefix
 * @param {Request} req - The incoming request object
 * @param {string} prefix - Prefix for the rate limit key (e.g., 'login', 'forgotpw')
 * @param {Ratelimit} rateLimiter - The rate limiter instance to use
 * @param {string} customMessage - Custom error message (optional)
 * @returns {Response|null} Response object if rate limited, null otherwise
 */
export async function checkRateLimit(
  req,
  prefix,
  rateLimiter,
  customMessage = 'Too many attempts. Please try again later.',
) {
  const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await rateLimiter.limit(`${prefix}:${identifier}`);

  if (!success) {
    return Response.json(
      {
        success: false,
        message: customMessage,
      },
      { status: 429 },
    );
  }

  return null;
}
