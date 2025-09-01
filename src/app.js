require("dotenv").config();
const express = require("express");
const { connectDB } = require("./utils/connectDB");
const { listenPort } = require("./utils/listenPort");
const config = require("./config");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRouter");
const feedRoutes = require("./routes/feedRouter");
const profileRoutes = require("./routes/profileRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => res.send("Server is running"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/profile", profileRoutes);

const startServer = async () => {
  try {
    await connectDB();
    listenPort(app, config.PORT);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
