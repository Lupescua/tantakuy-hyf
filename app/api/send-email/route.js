import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, subject, text, html } = await req.json();
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }

}