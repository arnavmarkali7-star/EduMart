const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../../server/config/database");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Export for Netlify
module.exports = app;
