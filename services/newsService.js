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
    category: row[0]?.trim() || "general",
    datetime: toUnixSeconds(row[1]),
    headline: row[2]?.trim() || "Untitled headline",
    id: row[3] ? Number(row[3]) : index + 1,
    image: row[4] || "https://share.google/images/JQCdhWuXx6DOjbAMZ",
    source: row[5]?.trim() || "Unknown",
    summary: row[6]?.trim() || "",
    url: row[7]?.trim() || "#",
  };
}

/** Core: fetch rows from Google Sheets and map to JSON */
export async function fetchHeadlinesFromSheet() {
  try {
    const sheets = getSheetsClient();

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "CBN News!A2:H", // 👈 adjust if sheet/tab name changes
    });

    const rows = resp.data.values || [];
    return rows.map((row, idx) => mapRowToNews(row, idx));
  } catch (err) {
    console.error("❌ Error fetching from Google Sheets:", err.message);
    return [];
  }
}

/** Fetch latest news with pagination */
export async function fetchLatestNews({ page = 1, limit = 20, category } = {}) {
  let items = await fetchHeadlinesFromSheet();

  if (category) {
    items = items.filter(
      (n) => (n.category || "").toLowerCase() === category.toLowerCase()
    );
  }

  // Sort by datetime desc
  items.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));

  // Pagination logic
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginated = items.slice(startIndex, startIndex + limit);

  return {
    page,
    limit,
    total,
    totalPages,
    data: paginated,
  };
}
