// services/newsService.js
import { getSheetsClient } from "../config/googleSheets.js";

/** Convert Sheet datetime cell to UNIX seconds */
function toUnixSeconds(v) {
  if (!v && v !== 0) return Math.floor(Date.now() / 1000);
  if (typeof v === "number") return Math.floor(v); // already epoch?
  const asNum = Number(v);
  if (!Number.isNaN(asNum)) return Math.floor(asNum); // numeric string epoch
  const parsed = Date.parse(v); // ISO/date string
  return Number.isNaN(parsed)
    ? Math.floor(Date.now() / 1000)
    : Math.floor(parsed / 1000);
}

/** Map a Sheet row (array) → News object */
function mapRowToNews(row, index) {
  return {
    category: row[0] || "general",
    datetime: toUnixSeconds(row[1]),
    headline: row[2] || "Untitled headline",
    id: row[3] ? Number(row[3]) : index + 1,
    image: row[4] || "https://via.placeholder.com/800x400?text=No+Image",
    source: row[6] || "Unknown",
    summary: row[7] || "",
    url: row[8] || "#",
  };
}

/** Core: fetch rows from Google Sheets and map to JSON */
export async function fetchHeadlinesFromSheet() {
  try {
    const sheets = getSheetsClient();

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A2:H", // Adjust if sheet/tab name changes
    });

    const rows = resp.data.values || [];
    return rows.map(mapRowToNews);
  } catch (err) {
    console.error("❌ Error fetching from Google Sheets:", err.message);
    return [];
  }
}

/** Optional helpers for controllers */
export async function fetchLatestNews({ limit = 10, category } = {}) {
  let items = await fetchHeadlinesFromSheet();
  if (category) {
    items = items.filter(
      (n) => (n.category || "").toLowerCase() === category.toLowerCase()
    );
  }
  // Sort by datetime desc if present
  items.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
  return items.slice(0, limit);
}
