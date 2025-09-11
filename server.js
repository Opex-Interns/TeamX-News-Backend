//server.js
import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cron from "node-cron";
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger.js";

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


// Swagger Docs
app.use(
  "/api-docs",
  swaggerUiMiddleware.serve,
  swaggerUiMiddleware.setup(swaggerSpec)
);

// Cron: run daily at 8:00 AM Africa/Lagos
cron.schedule(
  "* * * * *",
  async () => {
    console.log("⏰ Running daily newsletter job…");
    await runNewsletterJob();
  },
  // { timezone: process.env.TZ || "Africa/Lagos" }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  {console.log(`🚀 Server running on port ${PORT}`)
    console.log("Email:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("Key exists:", !!process.env.GOOGLE_PRIVATE_KEY);
console.log("Using Google Service Account:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("PRIVATE_KEY starts with:", process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30));



  });
