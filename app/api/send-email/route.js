import { NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import { sendEmail } from '@/utils/sendEmail';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.tokenBucket(10, '15 m', 3),
  analytics: true,
});
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

export async function POST(request) {
  const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { success: false, message: 'Too many requests' },
      { status: 429 },
    );
  }

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
