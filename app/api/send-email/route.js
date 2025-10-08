import { NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { sendEmail } from '@/utils/sendEmail';
import { createRateLimiter, checkRateLimit } from '@/utils/rateLimit';

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
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: validated.error.errors,
        },
        { status: 400 },
      );
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send failed:', err.message);
    return NextResponse.json(
      { success: false, message: 'Email send failed' },
      { status: 500 },
    );
  }
}
