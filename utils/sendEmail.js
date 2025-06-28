import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,         
      pass: process.env.EMAIL_APP_PASSWORD,   
    },
  });

  return transporter.sendMail({
    from: `"Tantakuy" <${process.env.EMAIL_USER}>`, 
    to,
    subject,
    html,
  });
}