const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendMail = async ({ to, subject, text, html, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Servizio Local Services Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments
    });
    console.log("✉️ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    // In dev mode, do not throw so testing continues smoothly if SMTP credentials are sample
    if (process.env.NODE_ENV === "development") {
      return { mock: true, messageId: "dev-mock-id" };
    }
    throw error;
  }
};

module.exports = { sendMail };
