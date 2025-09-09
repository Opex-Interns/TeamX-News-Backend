import { google } from "googleapis";

export function getSheetsAuth() {
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );
}

export function getSheetsClient(auth) {
  return google.sheets({ version: "v4", auth });
}
