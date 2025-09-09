import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cron from "node-cron";

import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import { runNewsletterJob } from "./services/newsletterJob.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB
await connectDB();

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/subscribers", subscriberRoutes);

// Cron: run daily at 8:00 AM Africa/Lagos
cron.schedule(
  "0 8 * * *",
  async () => {
    console.log("⏰ Running daily newsletter job…");
    await runNewsletterJob();
  },
  { timezone: process.env.TZ || "Africa/Lagos" }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
