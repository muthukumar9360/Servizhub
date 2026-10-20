const nodemailer = require("nodemailer");
const User = require("../models/User");

// Temporary OTP store (can replace with Redis/DB)
let forgetOtpStore = {};

// Helper: generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Step 1: Send OTP
const sendOtp = async (req, res) => {
  const { username, email, phno } = req.body;

  try {
    if (!username || !email || !phno) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const user = await User.findOne({ username, email, phno });
    if (!user) {
      return res.status(404).json({ message: "User not found with given details" });
    }

    const otp = generateOtp();
    forgetOtpStore[email] = { otp, expires: Date.now() + 2 * 60 * 1000 }; // 2 min validity

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Servizio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting password is ${otp}. It is valid for 2 minutes.`,
    });

    res.json({ message: "OTP sent successfully", email });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Step 2: Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

  const record = forgetOtpStore[email];
  if (!record) return res.status(400).json({ message: "No OTP found for this email" });
  if (Date.now() > record.expires) {
    delete forgetOtpStore[email];
    return res.status(400).json({ message: "OTP expired" })};
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  // OTP verified but don’t reset password yet
  forgetOtpStore[email].verified = true;

  res.json({ message: "OTP verified successfully" });
};

// ✅ Step 3: Change Password
const changePassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const record = forgetOtpStore[email];
  if (!record || !record.verified) {
    return res.status(400).json({ message: "OTP verification required" });
  }

  try {
    await User.findOneAndUpdate({ email }, { password: newPassword });

    delete forgetOtpStore[email]; // clear after password reset

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendOtp, verifyOtp, changePassword };
