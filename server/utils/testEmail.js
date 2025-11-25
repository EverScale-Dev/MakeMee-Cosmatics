const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'makemeecosmetics@gmail.com',
    pass: 'jlcj efit pgvr xxvf'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const mailOptions = {
  from: 'MakeMee_Cosmetics <makemeecosmetics@gmail.com>',
  to: 'makemeecosmetics@gmail.com',
  subject: 'Testing Nodemailer',
  text: 'This is a test email from Nodemailer!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error:', error);
  }
  // console.log('Email sent:', info.response);
});
