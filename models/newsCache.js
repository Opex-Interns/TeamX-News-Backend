// models/newsCache.js
import mongoose from "mongoose";

const newsCacheSchema = new mongoose.Schema({
  // Use either Sheet `id` (preferred) or fallback to URL as a unique key
  uniqueKey: { type: String, required: true, unique: true, index: true },

  // Core news fields
  category: { type: String, default: "general" },
  datetime: { type: Number }, // stored as UNIX seconds
  headline: String,
  id: Number,
  image: String,
  source: String,
  summary: String,
  url: String,

  // When cached
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("NewsCache", newsCacheSchema);
