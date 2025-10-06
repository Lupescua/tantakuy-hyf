import { NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';
// import your transporter or mail service as before

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ success: false, message: 'Missing to/subject/html' }, { status: 400 });
    }

    const safeHtml = sanitizeHtml(html, {
      allowedTags: ['b','i','em','strong','a','p','br','ul','ol','li','h1','h2','h3','h4','h5','h6','blockquote','code','pre'],
      allowedAttributes: { a: ['href','name','target'], '*': ['style'] },
      allowedSchemes: ['http','https','mailto'],
    });

    // await transporter.sendMail({ to, subject, html: safeHtml, from: process.env.EMAIL_FROM });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Email send failed' }, { status: 500 });
  }
}
