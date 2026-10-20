const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Razorpay = require("razorpay");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const Message = require("./models/Message");

// Import Servizio Route Handlers
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const otpRoutes = require("./routes/otpRoutes");
const forgetRoutes = require("./routes/forgetRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const businessRoutes = require("./routes/businessRoutes");
const businesslistRoutes = require("./routes/businesslistRoutes");
const messageRoutes = require("./routes/messageRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const savedRoutes = require("./routes/savedRoutes");
const searchRoutes = require("./routes/searchRoutes");
const guideRoutes = require("./routes/guideRoutes");
const businessEmailRoutes = require("./routes/businessEmailRoutes");

const app = express();
const server = http.createServer(app);

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Express Session Support
app.use(
  session({
    secret: process.env.SESSION_SECRET || "servizio_session_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Rate Limiting
app.use("/api/", apiLimiter);

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

// Razorpay payment route
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1,
      notes: {
        payment_for: "Servizio Local Service Marketplace",
      },
    };

    const order = await razorpay.orders.create(options);
    return res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("❌ Razorpay API Error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to create order" });
  }
});

// Mount routes on both /api and /api/v1
const registerRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/session`, sessionRoutes);
  app.use(`${prefix}/otp`, otpRoutes);
  app.use(`${prefix}/forget`, forgetRoutes);
  app.use(`${prefix}/services`, serviceRoutes);
  app.use(`${prefix}/subcategory`, subcategoryRoutes);
  app.use(`${prefix}/userprofile`, userProfileRoutes);
  app.use(`${prefix}/business`, businessRoutes);
  app.use(`${prefix}/businesslist`, businesslistRoutes);
  app.use(`${prefix}/chat`, messageRoutes);
  app.use(`${prefix}/favourites`, favouriteRoutes);
  app.use(`${prefix}/saved`, savedRoutes);
  app.use(`${prefix}/search`, searchRoutes);
  app.use(`${prefix}/guides`, guideRoutes);
  app.use(`${prefix}/business-email`, businessEmailRoutes);

  app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date(),
      message: "Servizio Local Services Marketplace API is healthy",
    });
  });
};

registerRoutes("/api/v1");
registerRoutes("/api");

// Socket.IO Chat Setup
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket User connected:", socket.id);

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const room = [senderId, receiverId].sort().join("_");
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const message = new Message({ senderId, receiverId, text });
      await message.save();
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("receiveMessage", message);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// REST API for Chat history
app.get("/api/chat/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5024;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`🚀 Servizio Local Service Marketplace Backend running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
  });
}

module.exports = app;
