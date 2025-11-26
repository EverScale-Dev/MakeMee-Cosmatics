const nodemailer = require("nodemailer");

const receiveMail = async ({ name, email, subject, message }) => {
  try {
    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required to send email");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === "true" || true, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App password if Gmail
      },
      tls: {
        rejectUnauthorized: false, // avoids self-signed certificate issues
      },
    });

    // Mail options
    const mailOptions = {
      from: `"MakeMee Cosmetics" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO || process.env.SMTP_USER, // allow different recipient
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
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
};

module.exports = receiveMail;
