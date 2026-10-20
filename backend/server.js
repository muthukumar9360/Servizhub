const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo.MongoStore || connectMongo;
require("dotenv").config();
const connectDB = require("./config/db");
const Razorpay = require("razorpay");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message"); // ✅ Create this model

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        allowedOrigins.some((allowed) => allowed === cleanOrigin || allowed === origin) ||
        cleanOrigin.endsWith(".web.app") ||
        cleanOrigin.endsWith(".firebaseapp.com") ||
        cleanOrigin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      } else {
        console.warn("CORS warning - origin not in explicit whitelist:", origin);
        return callback(null, true); // Allow to prevent hard failures while logging
      }
    },
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "servizio-backend", timestamp: new Date() });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "servizio_master_secret_session_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);


// ✅ Connect to DB
connectDB();

// ✅ Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // ✅ Correct order creation
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1,
      notes: {
        payment_for: "Freelance Marketplace",
      },
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order);
    return res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("❌ Razorpay API Error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to create order" });
  }
});

//hello welcome
// ✅ Import all your existing routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/session", require("./routes/sessionRoutes"));
app.use("/api/guides", require("./routes/guideRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/forget", require("./routes/forgetRoutes"));
app.use("/api/subcategory", require("./routes/subcategoryRoutes"));
app.use("/api/userprofile", require("./routes/userProfileRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/businesslist", require("./routes/businesslistRoutes"));
app.use("/api/chat", require("./routes/messageRoutes"));
app.use("/api/favourites", require("./routes/favouriteRoutes"));
app.use("/api/saved", require("./routes/savedRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/business-email",  require("./routes/businessEmailRoutes"));

const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow requests with no origin
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        allowedOrigins.some((allowed) => allowed === cleanOrigin || allowed === origin) ||
        cleanOrigin.endsWith(".web.app") ||
        cleanOrigin.endsWith(".firebaseapp.com") ||
        cleanOrigin.endsWith(".vercel.app");
      callback(null, isAllowed ? origin : true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // When user joins a chat room
  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const room = [senderId, receiverId].sort().join("_");
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // When a message is sent
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const message = new Message({ senderId, receiverId, text });
      await message.save();
      console.log("✅ Message saved:", message);
      const room = [senderId, receiverId].sort().join("_");
      io.to(room).emit("receiveMessage", message); // Send message to both users
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ REST API to fetch chat messages between two users
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

// ✅ Start server
const PORT = process.env.PORT || 5024;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
