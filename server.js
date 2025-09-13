// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger.js";
import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import jobs from "./config/cron.js";

dotenv.config();
await connectDB();

const app = express();
jobs.start(); // ✅ start all cron jobs from one place

// Define your list of allowed domains
const allowedOrigins = [
  "http://localhost:5000",
  "https://financedaily-backend.onrender.com",
  "https://financedaily.netlify.app",
];

// Middleware
app.use(
  cors({
    origin: "*", // 👈 allow all for now, restrict later with allowedOrigins if needed
  })
);

app.use(express.json());

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/subscribers", subscriberRoutes);

// Swagger Docs
app.use(
  "/api-docs",
  swaggerUiMiddleware.serve,
  swaggerUiMiddleware.setup(swaggerSpec)
);

// Health check route (for Render + PingJob)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
