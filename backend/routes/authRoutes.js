const express = require("express");
const querystring = require("querystring");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const { loginUser, registerUser, googleSignup, googleLogin } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

// ================= Normal Routes =================
router.post("/signup", registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ success: true, user: req.session.user });
  }
  return res.status(401).json({ success: false, message: "Not authenticated" });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
});

// ================= Google OAuth Config =================
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_SIGNUP = `${process.env.SERVER_URL || "http://localhost:5024/api"}/auth/google/callback-signup`;
const REDIRECT_LOGIN = `${process.env.SERVER_URL || "http://localhost:5024/api"}/auth/google/callback-login`;

// Start Google Signup flow
router.get("/google/signup", (req, res) => {
  if (!CLIENT_ID) return res.status(500).send("Google Client ID not configured");
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_SIGNUP,
    response_type: "code",
    scope: "openid email profile",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Start Google Login flow
router.get("/google/login", (req, res) => {
  if (!CLIENT_ID) return res.status(500).send("Google Client ID not configured");
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_LOGIN,
    response_type: "code",
    scope: "openid email profile",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// ================= Google Signup Callback =================
router.get("/google/callback-signup", async (req, res) => {
  const code = req.query.code;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_SIGNUP,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const userInfo = await userInfoRes.json();

    const { email, sub: googleId, given_name: firstname, family_name: lastname, birthdate: dob } = userInfo;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect(`${clientUrl}/loginsignup?error=account_exists`);
    }

    res.redirect(
      `${clientUrl}/loginsignup/signup?email=${encodeURIComponent(email)}&googleId=${encodeURIComponent(googleId)}&firstname=${encodeURIComponent(firstname || "")}&lastname=${encodeURIComponent(lastname || "")}${dob ? `&dob=${encodeURIComponent(dob)}` : ""}`
    );
  } catch (err) {
    console.error("Google Signup Callback Error:", err);
    res.redirect(`${clientUrl}/loginsignup?error=server_error`);
  }
});

// ================= Google Login Callback =================
router.get("/google/callback-login", async (req, res) => {
  const code = req.query.code;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_LOGIN,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const userInfo = await userInfoRes.json();
    const { email, sub: googleId } = userInfo;

    const user = await User.findOne({ googleId, email, isGoogleAccount: true });
    if (!user) {
      return res.redirect(`${clientUrl}/loginsignup?error=not_registered`);
    }

    req.session.user = {
      username: user.username,
      email: user.email,
      phno: user.phno,
      userId: user._id,
      userType: user.userType,
    };

    res.redirect(`${clientUrl}/?login=success`);
  } catch (err) {
    console.error("Google Login Callback Error:", err);
    res.redirect(`${clientUrl}/loginsignup?error=server_error`);
  }
});

// ================= Explicit Google Signup/Login API =================
router.post("/google-signup", googleSignup);
router.post("/google-login", googleLogin);

module.exports = router;
