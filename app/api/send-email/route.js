import { sendEmail } from '@/utils/sendEmail';

export async function POST(req) {
  const { to, subject, html } = await req.json();
  try {
    await sendEmail({ to, subject, text: stripHtml(html), html });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send failed:', err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
