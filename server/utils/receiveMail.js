const nodemailer = require("nodemailer");

const receiveMail = async ({ name, email, subject, message }) => {
  try {
    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required to send email");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Mail options
    const mailOptions = {
      from: `"MakeMee Cosmetics" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `📩 New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="margin-bottom: 10px; color: #0A2540;">📥 New Enquiry Received</h2>
          <p style="margin: 0 0 15px;">You have received a new enquiry through the <strong>MakeMee Cosmetics</strong> website contact form.</p>

          <h3 style="margin-bottom: 8px; color: #0A2540;">Customer Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <h3 style="margin-top: 20px; margin-bottom: 8px; color: #0A2540;">Message:</h3>
          <div style="padding: 12px; background: #f6f6f6; border-radius: 6px;">
            <p style="white-space: pre-line; margin: 0;">${message}</p>
          </div>

          <hr style="margin: 25px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="font-size: 12px; color: #777;">
            This enquiry was generated from the official MakeMee Cosmetics website.
            Please respond to the customer at your earliest convenience.
          </p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error sending contact form email:", error);
    throw error;
  }
};

module.exports = receiveMail;
