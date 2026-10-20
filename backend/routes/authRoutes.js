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

const getClientUrl = () => {
  return (process.env.CLIENT_URL || "https://servizhub.netlify.app").replace(/\/$/, "");
};

// Dynamically resolve redirect URI to match the exact mount point (/api/v1/auth, /api/auth, or /auth)
const resolveRedirectForReq = (req, type) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const origin = host
    ? `${proto}://${host}`
    : process.env.SERVER_URL
    ? process.env.SERVER_URL.replace(/\/api.*$/, "")
    : "https://servizhub.onrender.com";

  if (req.originalUrl && req.originalUrl.includes("/api/v1/auth")) {
    return `${origin}/api/v1/auth/google/callback-${type}`;
  } else if (req.originalUrl && req.originalUrl.includes("/api/auth")) {
    return `${origin}/api/auth/google/callback-${type}`;
  } else if (req.originalUrl && req.originalUrl.includes("/auth")) {
    return `${origin}/auth/google/callback-${type}`;
  }

  if (process.env.SERVER_URL) {
    const base = process.env.SERVER_URL.replace(/\/$/, "");
    return `${base}/auth/google/callback-${type}`;
  }
  return `${origin}/api/v1/auth/google/callback-${type}`;
};

// Start Google Signup flow
router.get("/google/signup", (req, res) => {
  const redirect_uri = resolveRedirectForReq(req, "signup");
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri,
    response_type: "code",
    scope: "openid email profile",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Start Google Login flow
router.get("/google/login", (req, res) => {
  const redirect_uri = resolveRedirectForReq(req, "login");
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri,
    response_type: "code",
    scope: "openid email profile",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// ================= Google Signup Callback =================
router.get("/google/callback-signup", async (req, res) => {
  const code = req.query.code;
  const redirect_uri = resolveRedirectForReq(req, "signup");

  try {
    // 1️⃣ Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri,
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
      return res.redirect(`${getClientUrl()}/loginsignup?error=account_exists`);
    }

    // 4️⃣ Redirect to frontend signup form with prefilled info
    res.redirect(
      `${getClientUrl()}/loginsignup/signup?email=${encodeURIComponent(email)}&googleId=${encodeURIComponent(googleId)}&firstname=${encodeURIComponent(firstname || "")}&lastname=${encodeURIComponent(lastname || "")}${dob ? `&dob=${encodeURIComponent(dob)}` : ""}`
    );
  } catch (err) {
    console.error("Google Signup Callback Error:", err);
    res.redirect(`${getClientUrl()}/loginsignup?error=server_error`);
  }
});

// ================= Google Login Callback =================
router.get("/google/callback-login", async (req, res) => {
  const code = req.query.code;
  const redirect_uri = resolveRedirectForReq(req, "login");

  try {
    // 1️⃣ Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    // 2️⃣ Get user info
    const userInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const userInfo = await userInfoRes.json();
    const { email, sub: googleId, given_name: firstname, family_name: lastname } = userInfo;

    // 3️⃣ Attempt Google Login
    let user = await User.findOne({ googleId, email, isGoogleAccount: true });
    if (!user) {
      // Check if user exists by email and link google account
      const emailUser = await User.findOne({ email });
      if (emailUser) {
        emailUser.googleId = googleId;
        emailUser.isGoogleAccount = true;
        await emailUser.save();
        user = emailUser;
      } else {
        // Not registered yet, redirect to signup with prefilled details
        return res.redirect(
          `${getClientUrl()}/loginsignup/signup?email=${encodeURIComponent(email)}&googleId=${encodeURIComponent(googleId)}&firstname=${encodeURIComponent(firstname || "")}&lastname=${encodeURIComponent(lastname || "")}`
        );
      }
    }

    // 4️⃣ Set session
    req.session.user = {
      username: user.username,
      email: user.email,
      phno: user.phno,
      userId: user._id,
      userType: user.userType,
    };

    req.session.save((saveErr) => {
      if (saveErr) console.error("Session save error:", saveErr);
      const userParam = encodeURIComponent(
        JSON.stringify({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          _id: user._id,
          userId: user._id,
          userType: user.userType,
        })
      );
      // 5️⃣ Redirect to dashboard/home with user payload
      res.redirect(`${getClientUrl()}/?login=success&user=${userParam}`);
    });
  } catch (err) {
    console.error("Google Login Callback Error:", err);
    res.redirect(`${getClientUrl()}/loginsignup?error=server_error`);
  }
});

// ================= Explicit Google Signup/Login API =================
router.post("/google-signup", googleSignup);
router.post("/google-login", googleLogin);

module.exports = router;
