// sendBrevoOtp.js
import fetch from "node-fetch";

// ✅ Use your new Brevo API v3 key here
const API_KEY = "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";

const sendOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const email = "2312099@nec.edu.in"; // recipient

  console.log(`📧 Sending OTP ${otp} to ${email}...`);

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Servizio", email: "perumpatayans@gmail.com" },
        to: [{ email }],
        subject: "Your OTP Code for Servizio",
        htmlContent: `
          <div style="font-family:Arial;text-align:center;">
            <h2>🔐 Email Verification</h2>
            <p>Your OTP code is:</p>
            <h1 style="color:#2b6cb0;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
};

sendOtp();
