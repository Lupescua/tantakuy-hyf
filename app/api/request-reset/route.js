import { sendResetLink } from '@/app/services/resetLinkServices';
import { sendEmail } from '@/utils/sendEmail';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
});

export async function POST(req) {
  const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(`reset:${identifier}`);

  if (!success) {
    return Response.json(
      {
        success: false,
        message: 'Too many reset requests. Please try again later.',
      },
      { status: 429 },
    );
  }

  try {
    const { email } = await req.json();
    const resetLink = await sendResetLink(email);
    await sendEmail({
      to: email,
      subject: 'Reset your password - Tantakuy',
      html: `
        <p>Klik på <a href="${resetLink}">[ linket ] </a>for at nulstille din adgangskode:</p>
        <p>Linket udløber om 15 minutter.</p>
      `,
    });
    return Response.json({ success: true, message: 'Reset link sent' });
  } catch (error) {
    console.error('Error in request-reset:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
