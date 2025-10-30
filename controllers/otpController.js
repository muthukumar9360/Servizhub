const nodemailer = require("nodemailer");
const User = require("../models/User");
const { registerUser } = require("./authController");

// Temporary OTP store (replace with Redis/DB in production)
let otpStore = {};

// Helper: generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
const sendOtp = async (req, res) => {
  const { firstname, lastname, phno, email, username, dob, userType, gender, password, confirmPassword } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Email required" });

    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phno }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    const otp = generateOtp();
    otpStore[email] = {
      otp,
      expires: Date.now() + 60 * 1000,
      userData: { firstname, lastname, phno, email, username, dob, userType, gender, password, confirmPassword },
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Servizio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 1 minute.`,
    });

    res.json({ message: "OTP sent", email });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: "No OTP found for this email" });

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp.trim() !== String(otp).trim()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Register new user
    const existingUser = await User.findOne({
      $or: [
        { username: record.userData.username },
        { email: record.userData.email },
        { phno: record.userData.phno }
      ]
    });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // ✅ safer than mutating req.body
    await registerUser({ body: record.userData, session: req.session }, res);

    delete otpStore[email]; // cleanup
  } catch (error) {
    console.error("OTP verification / registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: "No signup in progress" });

  const newOtp = generateOtp();
  otpStore[email].otp = newOtp;
  otpStore[email].expires = Date.now() + 60 * 1000;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Servizio" <${process.env.EMAIL_USER}>`, 
      to: email,
      subject: "Resent OTP Code",
      text: `Your new OTP is ${newOtp}. It is valid for 1 minute.`,
    });

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendOtp, verifyOtp, resendOtp };
