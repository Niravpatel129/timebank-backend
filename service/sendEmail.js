const nodemailer = require('nodemailer');

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.GAMERCOACH_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email templates
const emailTemplates = {
  signupVerificationEmail: (data) => ({
    subject: 'Verify your email to log on to Hour Block',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid black; margin: 0 auto;"></div>
        </div>
        <h2 style="text-align: center; color: #000;">Verify your email to log on to Hour Block</h2>
        <p>Hello ${data.name},</p>
        <p>We have received a login attempt from with the following code:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; margin: 20px 0;">
          <strong>${data.verificationCode}</strong>
        </div>
        <p>To complete the login process, please click the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.verificationUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block;">VERIFY</a>
        </div>
        <p>Or copy and paste this URL into a new tab of your browser:</p>
        <p><a href="${data.verificationUrl}" style="color: #0070f3; word-break: break-all;">${data.verificationUrl}</a></p>
        <p style="color: #666; font-size: 0.9em;">If you didn't attempt to log in but received this email, or if the location doesn't match, please ignore this email. If you are concerned about your account's safety, please visit our Help page to get in touch with us.</p>
      </div>
    `,
  }),
  // Add more email templates here as needed
};

// Function to send email
const sendEmail = async (to, templateName, data) => {
  try {
    console.log(`Attempting to send email to: ${to}`);

    if (!emailTemplates[templateName]) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const { subject, html } = emailTemplates[templateName](data);

    const mailOptions = {
      from: process.env.GAMERCOACH_EMAIL,
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
