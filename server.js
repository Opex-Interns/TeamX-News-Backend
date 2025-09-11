// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger.js";
import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

dotenv.config();
await connectDB();

const app = express();

// Define your list of allowed domains
const allowedOrigins = [
  "http://localhost:5000",
  "https://financedaily-backend.onrender.com", // Common port for local Vite apps
  "https://financedaily.netlify.app", // Your live production site
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
