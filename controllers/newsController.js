// controllers/newsController.js
import NewsCache from "../models/newsCache.js";
import { fetchLatestNews } from "../services/newsService.js";

/**
 * Get paginated news from MongoDB (cached) or Sheets fallback
 */
export async function getNews(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const category = req.query.category;

    // Fetch all cached items
    let items = await NewsCache.find().sort({ datetime: -1 }).lean();

    // Filter by category if provided
    if (category) {
      items = items.filter(
        (n) => (n.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    // Fallback if cache is empty
    if (!items.length) {
      items = await fetchLatestNews({ limit: 100, category });
    }

    // Pagination logic
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      data: paginated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching news",
      error: err.message,
    });
  }
}
