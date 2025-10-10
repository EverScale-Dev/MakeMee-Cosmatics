const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: 'MakeMee_Cosmetics <fujailbrandmake@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments || [], // Attachments can now be included
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
