import connectDB from "@/config/db";
import Broadcast from "@/models/Broadcast";
import Subscriber from "@/models/Subscriber";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Email config
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET() {
  await connectDB();

  // Get broadcasts that are scheduled and the time has passed
  const now = new Date();
  const broadcasts = await Broadcast.find({
    status: "scheduled",
    scheduledFor: { $lte: now },
  });

  if (!broadcasts.length) {
    return NextResponse.json({ success: true, message: "No scheduled broadcasts due." });
  }

  for (const broadcast of broadcasts) {
    const subscribers = await Subscriber.find();
    const recipientEmails = subscribers.map((s) => s.email);

    const attachments = (broadcast.attachment || []).map((url, index) => ({
      filename: `attachment-${index + 1}`,
      path: url,
    }));

    const attachmentsHtml = (broadcast.attachment || []).map((url, i) => {
      return url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
        ? `<img src="${url}" style="max-width:100%; height:auto;" />`
        : `<p><a href="${url}" target="_blank">View Attachment ${i + 1}</a></p>`;
    }).join("");

    const results = [];

    for (const email of recipientEmails) {
      try {
        await transporter.sendMail({
          from: `"Cusceda NG" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: broadcast.subject,
          html: `
            <div style="padding: 20px; font-size: 16px;">
              <h2>${broadcast.subject}</h2>
              <p>${broadcast.message.replace(/\n/g, "<br>")}</p>
              ${attachmentsHtml}
              <p>Cheers,<br/>Cusceda NG Team</p>
            </div>
          `,
          attachments,
        });

        results.push({ email, status: "sent" });
      } catch (err) {
        results.push({ email, status: "failed", error: err.message });
      }
    }

    // Update the broadcast status
    broadcast.status = "sent";
    broadcast.recipients = results;
    await broadcast.save();
  }

  return NextResponse.json({ success: true, message: "Broadcasts sent successfully" });
}
