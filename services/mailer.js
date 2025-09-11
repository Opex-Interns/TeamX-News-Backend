//mailer
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465 , // true if port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendNewsletter(
  recipients,
  newsList,
  { subject = "📊 Daily Finance Headlines" } = {}
) {
  const toField = Array.isArray(recipients) ? recipients.join(",") : recipients;

  const itemsHtml = newsList
    .map(
      (n) => `
    <li style="margin:8px 0;">
      <a href="${n.url}" target="_blank" style="text-decoration:none;color:#2563eb;">
        ${n.headline}
      </a>
      <div style="font-size:12px;color:#6b7280;">
        ${n.source || "Source"} • ${new Date(
        (n.datetime || 0) * 1000
      ).toLocaleString()}
      </div>
    </li>
  `
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <h2>FinanceDaily</h2>
      <p>Here are your latest headlines:</p>
      <ul style="padding-left:18px;">${itemsHtml}</ul>
      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#9ca3af;">You’re receiving this because you subscribed to FinanceDaily.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"FinanceDaily" <${process.env.SMTP_USER}>`,
    to: toField,
    subject,
    html,
  });
}
