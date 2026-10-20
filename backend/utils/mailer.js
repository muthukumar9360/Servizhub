const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendMail = async ({ to, subject, html, attachments = [] }) => {
  return transporter.sendMail({
    from: `"Servizio" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};

module.exports = { sendMail };
