import { google } from "googleapis";

export function getSheetsAuth() {
  return new google.auth.GoogleAuth({
    keyFile: "config/financedaily-news-688de3ee0471.json", // path to your JSON file
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export function getSheetsClient(auth) {
  return google.sheets({ version: "v4", auth });
}
