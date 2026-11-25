
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

const PORT = process.env.PORT || 8080;

// Hide Express framework identification header
app.disable("x-powered-by");

// Limit JSON request body size
app.use(express.json({ limit: "16kb" }));

// Allow only configured frontend origins
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")
  .map(x => x.trim());

app.use(cors({
  origin: allowedOrigins
}));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// Verify required configuration
if (
  !process.env.MONGODB_URI ||
  !process.env.AUTH_SECRET ||
  process.env.AUTH_SECRET.length < 32
) {
  console.error(
    "Set MONGODB_URI and AUTH_SECRET (32+ characters) in Backend/.env"
  );

  process.exit(1);
}

// Connect database and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on ${PORT}`);
    });
  })
  .catch(err => {
    console.error(
      "Database connection failed",
      err.message
    );

    process.exit(1);
  });
