// worker.js
import dotenv from "dotenv";
import cron from "node-cron";
import connectDB from "./config/db.js";
import { runNewsletterJob } from "./services/newsletterJob.js";

dotenv.config();
await connectDB();

// Cron: run daily at 8:00 AM Africa/Lagos
cron.schedule("* * * * *", async () => {
  console.log("⏰ Running daily newsletter job…");
  await runNewsletterJob();
}, { timezone: process.env.TZ || "Africa/Lagos" });
