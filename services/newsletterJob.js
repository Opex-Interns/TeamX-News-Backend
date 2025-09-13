// jobs/newsletterJob.js
import Subscriber from "../models/subscriber.js";
import NewsCache from "../models/newsCache.js";
import { fetchHeadlinesFromSheet } from "../services/newsService.js";
import { sendNewsletter } from "../services/mailer.js";

/** Create a unique key for each news item */
function makeUniqueKey(news) {
  return news.url && news.url !== "#"
    ? `url:${news.url}`
    : `time:${news.datetime}`;
}

export async function runNewsletterJob() {
  console.log("📰 Running newsletter job...");

  try {
    // 1. Fetch all news from Google Sheets
    const allNews = await fetchHeadlinesFromSheet();

    if (!allNews.length) {
      console.log("⚠️ No news fetched from sheet.");
      return;
    }

    console.log(`✅ Retrieved ${allNews.length} headlines from sheet.`);

    // 2. Detect new (fresh) items and cache them
    const fresh = [];
    for (const item of allNews) {
      const uniqueKey = makeUniqueKey(item);

      const result = await NewsCache.updateOne(
        { uniqueKey },
        {
          $setOnInsert: {
            uniqueKey,
            headline: item.headline,
            summary: item.summary,
            image: item.image,
            datetime: item.datetime,
            category: item.category,
            source: item.source,
            url: item.url,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        fresh.push(item);
      }
    }

    if (!fresh.length) {
      console.log("ℹ️ No new headlines to send this run.");
      return;
    }

    console.log(`🆕 Cached ${fresh.length} new headlines.`);

    // 3. Fetch subscribers
    const subscribers = await Subscriber.find({}, { email: 1, _id: 0 });
    const emails = subscribers.map((s) => s.email);

    if (!emails.length) {
      console.log("ℹ️ No subscribers to send to.");
      return;
    }

    // 4. Limit how many items to send in the newsletter
    const maxItems = Number(process.env.DAILY_NEWS_MAX_ITEMS || 10);
    const toSend = fresh.slice(0, maxItems);

    console.log(
      `📩 Preparing to send ${toSend.length} headlines to ${emails.length} subscribers...`
    );

    // 5. Send out the newsletter
    await sendNewsletter(emails, toSend, {
      subject: "📩 FinanceDaily — Today’s Headlines",
    });

    console.log(
      `✅ Sent ${toSend.length} headlines to ${emails.length} subscribers.`
    );
  } catch (err) {
    console.error("❌ Newsletter job failed:", err.message);
  }
}
