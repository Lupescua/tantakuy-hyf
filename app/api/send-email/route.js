import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { sendEmail } from '@/utils/sendEmail';
import { createRateLimiter, checkRateLimit } from '@/utils/rateLimit';
import { badRequest, serverError, success } from '@/utils/apiResponse';

const ratelimit = createRateLimiter(10, '15 m', 'tokenBucket', 3);
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

export async function POST(request) {
  const rateLimitResponse = await checkRateLimit(
    request,
    'email',
    ratelimit,
    'Too many requests',
  );
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { to, subject, html } = await request.json();
    const validated = emailSchema.safeParse({ to, subject, html });
    if (!validated.success) {
      return badRequest('Invalid input', { errors: validated.error.errors });
    }

    const safeHtml = sanitizeHtml(html, {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'a',
        'p',
        'br',
        'ul',
        'ol',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'code',
        'pre',
      ],
      allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      transformTags: {
        a: (tagName, attribs) => ({
          tagName: 'a',
          attribs: {
            ...attribs,
            rel: 'noopener noreferrer nofollow',
          },
        }),
      },
    });

    await sendEmail({
      to,
      subject,
      html: safeHtml,
    });

    return success({});
  } catch (err) {
    return serverError('Email send failed', err);
  }
}
