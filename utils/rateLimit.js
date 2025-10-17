import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

/**
 * Extract the real client IP from request headers
 * Handles x-forwarded-for (comma-separated proxy chain) and x-real-ip
 *
 * IMPORTANT: This assumes your deployment has a trusted proxy/load balancer
 * (like Vercel, Cloudflare, nginx) that sets x-forwarded-for correctly.
 *
 * @param {Request} req - The incoming request object
 * @returns {string} The client IP address or 'anonymous' if unavailable
 */
function getClientIdentifier(req) {
  // Extract the leftmost (original client) IP from x-forwarded-for
  // Format: "client, proxy1, proxy2"
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : (req.headers.get('x-real-ip') ?? null);

  if (!clientIp) {
    // For anonymous users, create a fingerprint from user-agent
    // This provides better rate limiting than a single 'anonymous' identifier
    const userAgent = req.headers.get('user-agent') ?? 'unknown';
    const fingerprint = crypto
      .createHash('sha256')
      .update(userAgent)
      .digest('hex')
      .substring(0, 16);
    return `anon:${fingerprint}`;
  }

  return clientIp;
}

/**
 * Creates a rate limiter instance with specified configuration
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment
 *
 * @param {number} limit - Maximum number of requests allowed
 * @param {string} window - Time window (e.g., '15 m', '1 h')
 * @param {string} type - Type of limiter: 'sliding' or 'tokenBucket'
 * @param {number} refillRate - Refill rate for token bucket (required if type is 'tokenBucket')
 * @returns {Ratelimit} Configured rate limiter instance
 * @throws {Error} If refillRate is missing for tokenBucket type
 */
export function createRateLimiter(limit, window, type = 'sliding', refillRate) {
  // Validate parameters
  if (type === 'tokenBucket' && refillRate === undefined) {
    throw new Error(
      'refillRate is required when type is "tokenBucket". Example: createRateLimiter(10, "15 m", "tokenBucket", 3)',
    );
  }

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
 * Returns RFC 6585 compliant 429 response with Retry-After header
 *
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
  try {
    const identifier = getClientIdentifier(req);
    const { success, reset } = await rateLimiter.limit(
      `${prefix}:${identifier}`,
    );

    if (!success) {
      // Calculate seconds until rate limit resets (RFC 6585 compliant)
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);

      return Response.json(
        {
          success: false,
          message: customMessage,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
          },
        },
      );
    }

    return null;
  } catch (error) {
    // Error handling strategy: fail open (allow requests)
    // Rationale: Redis failures should not block legitimate users
    // Trade-off: Temporarily disables rate limiting during outages
    // Alternative: Change to 'fail closed' by returning 503 for critical endpoints
    console.error(`Rate limiter error (${prefix}):`, error.message);

    // Return null to allow the request to proceed
    return null;
  }
}
