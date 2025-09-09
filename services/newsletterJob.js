import Subscriber from "../models/subscriber.js";
import NewsCache from "../models/newsCache.js";
import { fetchHeadlinesFromSheet } from "./newsService.js";
import { sendNewsletter } from "./mailer.js";

function makeUniqueKey(news) {
  // Prefer an explicit ID from the sheet; else use the URL
  return news.id ? `id:${news.id}` : `url:${news.url}`;
}

export async function runNewsletterJob() {
  const all = await fetchHeadlinesFromSheet();
  if (!all.length) {
    console.log("ℹ️ No news fetched from sheet.");
    return;
  }

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

  const subscribers = await Subscriber.find({}, { email: 1, _id: 0 });
  const emails = subscribers.map((s) => s.email);
  if (!emails.length) {
    console.log("ℹ️ No subscribers yet.");
    return;
  }

  const maxItems = Number(process.env.DAILY_NEWS_MAX_ITEMS || 10);
  const slice = fresh.slice(0, maxItems);

  await sendNewsletter(emails, slice, {
    subject: "📩 FinanceDaily — Today’s Headlines",
  });
  console.log(
    `✅ Sent ${slice.length} headlines to ${emails.length} subscribers`
  );
}
