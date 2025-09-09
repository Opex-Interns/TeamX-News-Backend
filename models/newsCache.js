import mongoose from "mongoose";

const newsCacheSchema = new mongoose.Schema({
  // Use either Sheet `id` (preferred) or fallback to URL as a unique key
  uniqueKey: { type: String, required: true, unique: true, index: true },
  title: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("NewsCache", newsCacheSchema);
