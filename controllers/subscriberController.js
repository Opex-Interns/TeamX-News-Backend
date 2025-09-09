import Subscriber from "../models/subscriber.js";
import { fetchLatestNews } from "../services/newsService.js";
import { sendNewsletter } from "../services/mailer.js";

export async function addSubscriber(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) return res.status(400).json({ message: "Already subscribed" });

    await Subscriber.create({ email });

    // Optional: immediate welcome email with top headlines
    if (
      (process.env.WELCOME_EMAIL_ON_SUBSCRIBE || "true").toLowerCase() ===
      "true"
    ) {
      const latest = await fetchLatestNews({ limit: 5 });
      if (latest.length) {
        await sendNewsletter(email, latest, {
          subject: "🎉 Welcome to FinanceDaily",
        });
      }
    }

    res.status(201).json({ message: "Subscription successful!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Subscription failed", error: err.message });
  }
}
