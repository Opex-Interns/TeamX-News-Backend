// config/cron.js
import cron from "cron";
import https from "https";
import dotenv from "dotenv";
import { runNewsletterJob } from "../services/newsletterJob.js";
import NewsCache from "../models/newsCache.js";

dotenv.config();

/** 
 * 1. Keep backend awake on Render (every 14 mins)
 */
const pingJob = new cron.CronJob("*/14 * * * *", () => {
  const url = `${process.env.API_URL}/health`; // 👈 hit your health route
  https
    .get(url, (response) => {
      if (response.statusCode === 200) {
        console.log("✅ Ping job successful, server is awake.");
      } else {
        console.log("⚠️ Ping job failed with status:", response.statusCode);
      }
    })
    .on("error", (error) => {
      console.error("❌ Error while sending ping request:", error.message);
    });
});

/**
 * 2. Newsletter job (every hour)
 */
const newsletterJob = new cron.CronJob("* * * * *", async () => {
  console.log("⏰ Running hourly newsletter job...");
  await runNewsletterJob();
});

/**
 * 3. Cleanup MongoDB (every 24 hours at midnight)
 */
const cleanupJob = new cron.CronJob("0 0 * * *", async () => {
  try {
    const result = await NewsCache.deleteMany({});
    console.log(`🧹 Cleared ${result.deletedCount} old news from MongoDB.`);
  } catch (err) {
    console.error("❌ Error during cleanup:", err.message);
  }
});

/**
 * Export all jobs as a single manager
 */
const jobs = {
  start() {
    pingJob.start();
    newsletterJob.start();
    cleanupJob.start();
    console.log("✅ All cron jobs scheduled.");
  },
};

export default jobs;
