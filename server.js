
// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger.js";
import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import { runNewsletterJob } from "./services/newsletterJob.js";
import jobs from "./config/cron.js";

dotenv.config();
await connectDB();

const app = express();
jobs.start();

// Define your list of allowed domains
const allowedOrigins = [
  "http://localhost:5000",
  "https://financedaily-backend.onrender.com", 
  "https://financedaily.netlify.app", 
];

// Middleware
app.use(
  cors({
    // origin: allowedOrigins,
    origin:"*"
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

// ---------------------------
// Cron Job (runs every minute)
// ---------------------------
cron.schedule(
  "* * * * *",
  async () => {
    console.log("⏰ Running scheduled newsletter job…");
    await runNewsletterJob();
  },
  { timezone: process.env.TZ || "Africa/Lagos" }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

