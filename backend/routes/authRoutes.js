const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { loginUser, registerUser, googleSignup, googleLogin } = require("../controllers/authController");
const querystring = require("querystring");
const User = require("../models/User");

const router = express.Router();

// ================= Normal Routes =================
router.post("/signup", registerUser);
router.post("/login", loginUser);

// ================= Google OAuth Config =================
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_SIGNUP = `${process.env.SERVER_URL}/auth/google/callback-signup`;
const REDIRECT_LOGIN = `${process.env.SERVER_URL}/auth/google/callback-login`;

// Start Google OAuth flow
// Start Google Signup flow
router.get("/google/signup", (req, res) => {
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

  try {
    // 1️⃣ Exchange code for tokens
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

    // 2️⃣ Get user info
    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const userInfo = await userInfoRes.json();

    const { email, sub: googleId, given_name: firstname, family_name: lastname, birthdate: dob } = userInfo;

    // 3️⃣ Check if Google account already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect(`${process.env.CLIENT_URL}/loginsignup?error=account_exists`);
    }

    // 4️⃣ Redirect to frontend signup form with prefilled info
    res.redirect(
      `${process.env.CLIENT_URL}/loginsignup/signup?email=${encodeURIComponent(email)}&googleId=${encodeURIComponent(googleId)}&firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}${dob ? `&dob=${encodeURIComponent(dob)}` : ""}`
    );
  } catch (err) {
    console.error("Google Signup Callback Error:", err);
    res.redirect(`${process.env.CLIENT_URL}/loginsignup?error=server_error`);
  }
});

// ================= Google Login Callback =================
router.get("/google/callback-login", async (req, res) => {
  const code = req.query.code;

  try {
    // 1️⃣ Exchange code for tokens
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

    // 2️⃣ Get user info
    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const userInfo = await userInfoRes.json();
    const { email, sub: googleId } = userInfo;

    // 3️⃣ Attempt Google Login
    const user = await User.findOne({ googleId, email, isGoogleAccount: true });
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/loginsignup?error=not_registered`);
    }

    // 4️⃣ Set session
    req.session.user = {
      username: user.username,
      email: user.email,
      phno: user.phno,
      userId: user._id,
    };

    // 5️⃣ Redirect to dashboard/home
    res.redirect(`${process.env.CLIENT_URL}/?login=success`);
  } catch (err) {
    console.error("Google Login Callback Error:", err);
    res.redirect(`${process.env.CLIENT_URL}/loginsignup?error=server_error`);
  }
});

// ================= Explicit Google Signup/Login API =================
router.post("/google-signup", googleSignup);
router.post("/google-login", googleLogin);

module.exports = router;
