const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Generate a cryptographically secure 6-digit OTP
const generate6DigitOtp = () => {
  const buffer = crypto.randomBytes(4);
  const number = buffer.readUInt32BE(0) % 900000 + 100000;
  return number.toString();
};

// Hash OTP before database storage
const hashOtp = async (otpString) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otpString, salt);
};

// Compare plain OTP with hashed OTP
const compareOtp = async (plainOtp, hashedOtp) => {
  return await bcrypt.compare(plainOtp, hashedOtp);
};

module.exports = {
  generate6DigitOtp,
  hashOtp,
  compareOtp
};
