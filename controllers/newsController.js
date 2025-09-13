// controllers/newsController.js
import NewsCache from "../models/newsCache.js";
import { fetchLatestNews } from "../services/newsService.js";

/**
 * Get news from MongoDB (cached) or Sheets fallback
 */
export async function getNews(req, res) {
  try {
    const limit = Number(req.query.limit || 20);
    const category = req.query.category;

    // Fetch from MongoDB cache
    let items = await NewsCache.find().sort({ datetime: -1 }).lean();

    // Filter by category if provided
    if (category) {
      items = items.filter(
        (n) => (n.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    // If MongoDB is empty (first run), fallback to Sheets
    if (!items.length) {
      items = await fetchLatestNews({ limit, category });
    }

    res.json(items.slice(0, limit));
  } catch (err) {
    res.status(500).json({
      message: "Error fetching news",
      error: err.message,
    });
  }
}
