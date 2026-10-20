const User = require("../models/User");
const TemporaryRegistration = require("../models/TemporaryRegistration");
const Otp = require("../models/Otp");
const RefreshToken = require("../models/RefreshToken");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { generate6DigitOtp, hashOtp, compareOtp } = require("../utils/otpGenerator");
const { sendMail } = require("../utils/mailer");
const crypto = require("crypto");

// 1. REGISTER (Create TemporaryRegistration & Send Email OTP)
const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, phone, password, role } = req.body;

  // Check unique constraints in User collection
  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new ApiError(409, "Email is already registered.");

  const existingUsername = await User.findOne({ username });
  if (existingUsername) throw new ApiError(409, "Username is already taken.");

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) throw new ApiError(409, "Phone number is already registered.");

  // Remove previous temporary registration if exists
  await TemporaryRegistration.deleteMany({ $or: [{ email }, { username }, { phone }] });

  // Create TemporaryRegistration
  const tempUser = await TemporaryRegistration.create({
    fullName,
    username,
    email,
    phone,
    password, // Mongoose schema or save will handle or hash
    role: role === "PROVIDER" ? "PROVIDER" : "USER",
    step: "EMAIL_VERIFICATION_PENDING",
  });

  // Generate Email OTP
  const rawEmailOtp = generate6DigitOtp();
  const hashedEmailOtp = await hashOtp(rawEmailOtp);

  // Store Hashed OTP in unified Otp collection
  await Otp.create({
    ownerId: tempUser._id,
    ownerModel: "TemporaryRegistration",
    purpose: "EMAIL_VERIFICATION",
    channel: "EMAIL",
    otp: hashedEmailOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Send Email OTP
  await sendMail({
    to: email,
    subject: "Servizio - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to Servizio Local Services!</h2>
        <p>Hello ${fullName},</p>
        <p>Your 6-digit email verification OTP is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 4px;">${rawEmailOtp}</h1>
        <p>This code is valid for 10 minutes. Do not share this code with anyone.</p>
      </div>
    `,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        tempRegistrationId: tempUser._id,
        email: tempUser.email,
        step: "EMAIL_VERIFICATION_PENDING",
        // In development mode, provide OTP for ease of automated testing
        ...(process.env.NODE_ENV === "development" ? { devEmailOtp: rawEmailOtp } : {}),
      },
      "Registration initiated. Email OTP sent successfully."
    )
  );
});

// 2. VERIFY EMAIL OTP
const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { tempRegistrationId, otp } = req.body;

  const tempUser = await TemporaryRegistration.findById(tempRegistrationId);
  if (!tempUser) throw new ApiError(404, "Registration session expired or invalid.");

  const otpRecord = await Otp.findOne({
    ownerId: tempUser._id,
    ownerModel: "TemporaryRegistration",
    purpose: "EMAIL_VERIFICATION",
    usedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpRecord) throw new ApiError(400, "No active OTP found. Please request a new one.");

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired. Please request a new code.");
  }

  if (otpRecord.attemptCount >= otpRecord.maxAttempts) {
    throw new ApiError(429, "Maximum verification attempts exceeded. Please request a new OTP.");
  }

  const isValid = await compareOtp(otp, otpRecord.otp);
  if (!isValid) {
    otpRecord.attemptCount += 1;
    await otpRecord.save();
    throw new ApiError(400, `Invalid OTP. ${otpRecord.maxAttempts - otpRecord.attemptCount} attempts remaining.`);
  }

  // Mark OTP as used
  otpRecord.usedAt = new Date();
  await otpRecord.save();

  // Advance step to Phone Verification
  tempUser.step = "PHONE_VERIFICATION_PENDING";
  await tempUser.save();

  // Generate Phone OTP
  const rawPhoneOtp = generate6DigitOtp();
  const hashedPhoneOtp = await hashOtp(rawPhoneOtp);

  await Otp.create({
    ownerId: tempUser._id,
    ownerModel: "TemporaryRegistration",
    purpose: "PHONE_VERIFICATION",
    channel: "PHONE",
    otp: hashedPhoneOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tempRegistrationId: tempUser._id,
        phone: tempUser.phone,
        step: "PHONE_VERIFICATION_PENDING",
        ...(process.env.NODE_ENV === "development" ? { devPhoneOtp: rawPhoneOtp } : {}),
      },
      "Email verified. Phone OTP sent for final account creation."
    )
  );
});

// 3. RESEND EMAIL OTP
const resendEmailOtp = asyncHandler(async (req, res) => {
  const { tempRegistrationId } = req.body;
  const tempUser = await TemporaryRegistration.findById(tempRegistrationId);
  if (!tempUser) throw new ApiError(404, "Registration session not found.");

  await Otp.updateMany(
    { ownerId: tempUser._id, purpose: "EMAIL_VERIFICATION" },
    { usedAt: new Date() }
  );

  const rawEmailOtp = generate6DigitOtp();
  const hashedEmailOtp = await hashOtp(rawEmailOtp);

  await Otp.create({
    ownerId: tempUser._id,
    ownerModel: "TemporaryRegistration",
    purpose: "EMAIL_VERIFICATION",
    channel: "EMAIL",
    otp: hashedEmailOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendMail({
    to: tempUser.email,
    subject: "Servizio - Resent Email OTP",
    html: `<p>Your new email verification OTP is: <b>${rawEmailOtp}</b></p>`,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tempRegistrationId: tempUser._id,
        ...(process.env.NODE_ENV === "development" ? { devEmailOtp: rawEmailOtp } : {}),
      },
      "New Email OTP sent successfully."
    )
  );
});

// 4. VERIFY PHONE OTP & CREATE PERMANENT USER
const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { tempRegistrationId, otp } = req.body;

  const tempUser = await TemporaryRegistration.findById(tempRegistrationId);
  if (!tempUser) throw new ApiError(404, "Registration session expired.");

  const otpRecord = await Otp.findOne({
    ownerId: tempUser._id,
    ownerModel: "TemporaryRegistration",
    purpose: "PHONE_VERIFICATION",
    usedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpRecord) throw new ApiError(400, "No active phone OTP found.");

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "Phone OTP expired.");
  }

  const isValid = await compareOtp(otp, otpRecord.otp);
  if (!isValid) {
    otpRecord.attemptCount += 1;
    await otpRecord.save();
    throw new ApiError(400, "Invalid Phone OTP.");
  }

  otpRecord.usedAt = new Date();
  await otpRecord.save();

  // Create permanent User account
  const newUser = await User.create({
    fullName: tempUser.fullName,
    username: tempUser.username,
    email: tempUser.email,
    phone: tempUser.phone,
    password: tempUser.password, // Pre-save hook hashes password
    role: tempUser.role,
    status: "ACTIVE",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      identityVerified: false,
      addressVerified: false,
      adminApproved: false,
    },
    lastLogin: new Date(),
  });

  // Clean up TemporaryRegistration & temporary OTPs
  await TemporaryRegistration.findByIdAndDelete(tempUser._id);
  await Otp.deleteMany({ ownerId: tempUser._id });

  // Generate tokens
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  // Store RefreshToken record
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await RefreshToken.create({
    user: newUser._id,
    tokenHash,
    deviceInfo: req.headers["user-agent"] || "Web Browser",
    ipAddress: req.ip || req.connection.remoteAddress || "",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Log Audit Event
  await AuditLog.create({
    actor: newUser._id,
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: newUser._id,
    metadata: { role: newUser.role, email: newUser.email },
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return res
    .status(201)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        "Account created and verified successfully!"
      )
    );
});

// 5. RESEND PHONE OTP
const resendPhoneOtp = asyncHandler(async (req, res) => {
  const { tempRegistrationId } = req.body;
  const tempUser = await TemporaryRegistration.findById(tempRegistrationId);
  if (!tempUser) throw new ApiError(404, "Registration session not found.");

  await Otp.updateMany(
    { ownerId: tempUser._id, purpose: "PHONE_VERIFICATION" },
    { usedAt: new Date() }
  );

  const rawPhoneOtp = generate6DigitOtp();
  const hashedPhoneOtp = await hashOtp(rawPhoneOtp);

  await Otp.create({
    ownerId: tempUser._id,
    ownerModel: "TemporaryRegistration",
    purpose: "PHONE_VERIFICATION",
    channel: "PHONE",
    otp: hashedPhoneOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tempRegistrationId: tempUser._id,
        ...(process.env.NODE_ENV === "development" ? { devPhoneOtp: rawPhoneOtp } : {}),
      },
      "New Phone OTP generated successfully."
    )
  );
});

// 6. LOGIN
const login = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    throw new ApiError(400, "Login credentials are required");
  }

  // Find user by email, username, or phone
  const user = await User.findOne({
    $or: [
      { email: login.toLowerCase() },
      { username: login.toLowerCase() },
      { phone: login },
    ],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid login credentials.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    await AuditLog.create({
      actor: user._id,
      action: "LOGIN_FAILED",
      entityType: "User",
      entityId: user._id,
      metadata: { reason: "Incorrect password" },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    throw new ApiError(401, "Invalid login credentials.");
  }

  if (user.status === "SUSPENDED") {
    throw new ApiError(403, "Your account is suspended. Please contact platform administration.");
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await RefreshToken.create({
    user: user._id,
    tokenHash,
    deviceInfo: req.headers["user-agent"] || "Web Browser",
    ipAddress: req.ip || "",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await AuditLog.create({
    actor: user._id,
    action: "LOGIN_SUCCESS",
    entityType: "User",
    entityId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const userObj = user.toObject();
  delete userObj.password;

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: userObj,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// 7. LOGOUT
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (refreshToken) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await RefreshToken.findOneAndUpdate({ tokenHash }, { isRevoked: true });
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// 8. LOGOUT ALL DEVICES
const logoutAll = asyncHandler(async (req, res) => {
  await RefreshToken.updateMany({ user: req.user._id }, { isRevoked: true });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out from all devices successfully"));
});

// 9. REFRESH TOKEN (Token Rotation)
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  const jwt = require("jsonwebtoken");
  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_fallback_key"
    );
  } catch (err) {
    throw new ApiError(401, "Expired or invalid refresh token.");
  }

  const incomingHash = crypto.createHash("sha256").update(incomingRefreshToken).digest("hex");
  const tokenDoc = await RefreshToken.findOne({ tokenHash: incomingHash });

  if (!tokenDoc || tokenDoc.isRevoked || tokenDoc.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token is revoked or expired.");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.status === "SUSPENDED") {
    throw new ApiError(401, "Invalid user or account suspended.");
  }

  // Revoke old refresh token (Rotation)
  tokenDoc.isRevoked = true;
  await tokenDoc.save();

  // Issue new pair
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  const newHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
  await RefreshToken.create({
    user: user._id,
    tokenHash: newHash,
    deviceInfo: req.headers["user-agent"] || "Web Browser",
    ipAddress: req.ip || "",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed successfully"
      )
    );
});

// 10. FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json(new ApiResponse(200, {}, "If email is registered, OTP has been sent."));
  }

  const rawOtp = generate6DigitOtp();
  const hashedOtp = await hashOtp(rawOtp);

  await Otp.create({
    ownerId: user._id,
    ownerModel: "User",
    purpose: "PASSWORD_RESET",
    channel: "EMAIL",
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendMail({
    to: user.email,
    subject: "Servizio - Password Reset OTP",
    html: `<p>Your password reset OTP code is: <b style="font-size: 20px; color: #4F46E5;">${rawOtp}</b></p><p>Valid for 10 minutes.</p>`,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: user.email,
        ...(process.env.NODE_ENV === "development" ? { devResetOtp: rawOtp } : {}),
      },
      "Password reset OTP sent to email."
    )
  );
});

// 11. RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found.");

  const otpRecord = await Otp.findOne({
    ownerId: user._id,
    ownerModel: "User",
    purpose: "PASSWORD_RESET",
    usedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired reset OTP.");
  }

  const isValid = await compareOtp(otp, otpRecord.otp);
  if (!isValid) throw new ApiError(400, "Invalid reset OTP.");

  otpRecord.usedAt = new Date();
  await otpRecord.save();

  user.password = newPassword;
  await user.save();

  // Revoke all active sessions
  await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });

  await AuditLog.create({
    actor: user._id,
    action: "PASSWORD_CHANGED",
    entityType: "User",
    entityId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully. Please login with your new password."));
});

// 12. GET CURRENT AUTHENTICATED USER
const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current user profile retrieved"));
});

module.exports = {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  verifyPhoneOtp,
  resendPhoneOtp,
  login,
  logout,
  logoutAll,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
