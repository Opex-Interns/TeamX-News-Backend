// jobs/newsletterJob.js
import Subscriber from "../models/subscriber.js";
import NewsCache from "../models/newsCache.js";
import { fetchHeadlinesFromSheet } from "../services/newsService.js";
import { sendNewsletter } from "../services/mailer.js";

function makeUniqueKey(news) {
  // Prefer an explicit ID from the sheet; else use the URL
  return news.id ? `id:${news.id}` : `url:${news.url}`;
}

export async function runNewsletterJob() {
  console.log("📰 Running daily newsletter job...");

  // Debug: show what env values are being used
  //// console.log(
  // //  "Auth Method:",
   ////process.env.GOOGLE_API_KEY ? "API Key" : "Service Account"
  // );
  //// console.log("Sheet ID:", process.env.GOOGLE_SHEET_ID);

  try {
    const all = await fetchHeadlinesFromSheet();

    if (!all.length) {
      console.log("⚠️ No news fetched from sheet.");
      return;
    }

    console.log(`✅ Retrieved ${all.length} headlines from sheet.`);

    const fresh = [];
    for (const item of all) {
      const uniqueKey = makeUniqueKey(item);
      const exists = await NewsCache.findOne({ uniqueKey });
      if (!exists) {
        fresh.push(item);
        await NewsCache.create({
          uniqueKey,
          title: item.headline,
          url: item.url,
        });
      }
    }

    if (!fresh.length) {
      console.log("ℹ️ No new headlines to send today.");
      return;
    }

    console.log(`🆕 Cached ${fresh.length} new headlines.`);

    const subscribers = await Subscriber.find({}, { email: 1, _id: 0 });
    const emails = subscribers.map((s) => s.email);
    if (!emails.length) {
      console.log("ℹ️ No subscribers yet.");
      return;
    }

    const maxItems = Number(process.env.DAILY_NEWS_MAX_ITEMS || 10);
    const slice = fresh.slice(0, maxItems);

    console.log(
      `📩 Preparing to send ${slice.length} headlines to ${emails.length} subscribers...`
    );

    await sendNewsletter(emails, slice, {
      subject: "📩 FinanceDaily — Today’s Headlines",
    });

    console.log(
      `✅ Sent ${slice.length} headlines to ${emails.length} subscribers`
    );
  } catch (err) {
    console.error("❌ Newsletter job failed:", err.message);
  }
}
