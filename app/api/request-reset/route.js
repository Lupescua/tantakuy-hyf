import { sendResetLink } from '@/app/services/resetLinkServices';
import { sendEmail } from '@/utils/sendEmail';

export async function POST(req) {
  try {
    const { email } = await req.json();
    const resetLink = await sendResetLink(email);
    await sendEmail({
      to: email,
      subject: 'Reset your password - Tantakuy',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
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
