import { sendResetLink } from '@/app/services/resetLinkServices';
import { sendEmail } from '@/utils/sendEmail';
import { createRateLimiter, checkRateLimit } from '@/utils/rateLimit';

const ratelimit = createRateLimiter(3, '1 h');

export async function POST(req) {
  const rateLimitResponse = await checkRateLimit(
    req,
    'reset',
    ratelimit,
    'Too many reset requests. Please try again later.',
  );
  if (rateLimitResponse) return rateLimitResponse;

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
