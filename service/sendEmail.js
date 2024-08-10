const nodemailer = require('nodemailer');
const Email = require('email-templates');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.GAMERCOACH_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
});

const sendEmail = async (to, template, locals) => {
  try {
    await email.send({
      template: template,
      message: {
        to: to,
      },
      locals: locals,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
