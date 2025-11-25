const nodemailer = require("nodemailer");

const receiveMail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
  });

  await transporter.sendMail({
    from: `"MakeMee Cosmetics" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,       // send TO YOURSELF
    replyTo: email,
    subject: `📩 New Contact Form: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
};

module.exports = receiveMail;
