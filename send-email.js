
const fs = require("fs");
const nodemailer = require("nodemailer");

const template = fs.readFileSync("iibex_client_welcome.html", "utf8");

const clientName = process.env.CLIENT_NAME || "Client";
const recipient = process.env.TO_EMAIL;
const subject = process.env.SUBJECT || "Welcome to iibex";

if (!recipient) {
  throw new Error("TO_EMAIL is required");
}

const html = template.replace(/\[Client Name\]/g, clientName);

const transporter = nodemailer.createTransport({
  host: "smtp.protonmail.ch",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail() {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    subject: subject,
    html: html
  });

  console.log(`Email sent successfully to ${recipient}`);
}

sendEmail().catch((error) => {
  console.error("Email failed:", error);
  process.exit(1);
});
