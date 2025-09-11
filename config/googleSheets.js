// config/googleSheets.js
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// 🔒 Validate required environment variables
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

// 🟢 API Key (no private key or service account needed)
const apiKey = requireEnv("GOOGLE_API_KEY");

export function getSheetsClient() {
  return google.sheets({
    version: "v4",
    auth: apiKey, // ✅ Just use API key
  });
}
