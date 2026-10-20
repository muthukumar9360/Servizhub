const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const returnDamageRoutes = require("./routes/returnDamageRoutes");
const userInteractionRoutes = require("./routes/userInteractionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const session = require("express-session");
const inspectionRoutes = require("./routes/inspectionRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const equipmentDepotCategoryRoutes = require("./routes/equipmentDepotCategoryRoutes");
const equipmentDepotListingRoutes = require("./routes/equipmentDepotListingRoutes");
const equipmentDepotEmailRoutes = require("./routes/equipmentDepotEmailRoutes");
const equipmentServiceRoutes = require("./routes/equipmentServiceRoutes");
const equipmentSubcategoryRoutes = require("./routes/equipmentSubcategoryRoutes");
const equipmentOwnerProfileRoutes = require("./routes/equipmentOwnerProfileRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const savedRoutes = require("./routes/savedRoutes");
const searchRoutes = require("./routes/searchRoutes");
const guideRoutes = require("./routes/guideRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const otpRoutes = require("./routes/otpRoutes");
const forgetRoutes = require("./routes/forgetRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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
      secure: false,
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

// Mount routes on both /api/v1 and /api for frontend compatibility
const registerRoutes = (prefix) => {
  // Auth & User
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/session`, sessionRoutes);
  app.use(`${prefix}/otp`, otpRoutes);
  app.use(`${prefix}/forget`, forgetRoutes);
  app.use(`${prefix}/documents`, documentRoutes);
  app.use(`${prefix}/interactions`, userInteractionRoutes);
  app.use(`${prefix}/admin`, adminRoutes);

  // Service Provider & Businesses
  app.use(`${prefix}/equipment-depot-categories`, equipmentDepotCategoryRoutes);
  app.use(`${prefix}/business-categories`, equipmentDepotCategoryRoutes);
  app.use(`${prefix}/equipment-depot-listings`, equipmentDepotListingRoutes);
  app.use(`${prefix}/business-listings`, equipmentDepotListingRoutes);
  app.use(`${prefix}/equipment-depot-email`, equipmentDepotEmailRoutes);
  app.use(`${prefix}/equipment-services`, equipmentServiceRoutes);
  app.use(`${prefix}/equipment-subcategory`, equipmentSubcategoryRoutes);
  app.use(`${prefix}/equipment-owner-profile`, equipmentOwnerProfileRoutes);
  app.use(`${prefix}/favourites`, favouriteRoutes);
  app.use(`${prefix}/saved`, savedRoutes);
  app.use(`${prefix}/search`, searchRoutes);
  app.use(`${prefix}/guides`, guideRoutes);
  app.use(`${prefix}/messages`, messageRoutes);

  // Core Service Listing & Bookings
  app.use(`${prefix}/equipments`, equipmentRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/returns`, returnDamageRoutes);
  app.use(`${prefix}/inspections`, inspectionRoutes);
  app.use(`${prefix}/maintenance`, maintenanceRoutes);

  app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date(), message: "Servizio API is healthy" });
  });
};

registerRoutes("/api/v1");
registerRoutes("/api");

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5024;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servizio Master Equipment Platform Backend running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
  });
}

module.exports = app;
