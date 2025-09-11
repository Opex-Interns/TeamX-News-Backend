//comtrollers/newController
import { fetchLatestNews } from "../services/newsService.js";

export async function getNews(req, res) {
  try {
    const limit = Number(req.query.limit || 10);
    const category = req.query.category;
    const data = await fetchLatestNews({ limit, category });
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching news", error: err.message });
  }
}
