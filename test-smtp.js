// test-smtp.js
import express from "express";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello SMTP Test");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
