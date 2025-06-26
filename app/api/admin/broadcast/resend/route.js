import connectDB from "@/config/db";
import Broadcast from "@/models/Broadcast";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  await connectDB();

  try {
    const { id, email } = await req.json();

    if (!id || !email) {
      return NextResponse.json({ error: "Missing broadcast ID or email" }, { status: 400 });
    }

    const broadcast = await Broadcast.findById(id);
    if (!broadcast) {
      return NextResponse.json({ error: "Broadcast not found" }, { status: 404 });
    }

    const recipient = broadcast.recipients.find(r => r.email === email);
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found in broadcast" }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await await transporter.sendMail({
        from: `"Cusceda NG" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
            <p>${message}</p>
            ${attachmentUrl ? `<img src="cid:attached-image" style="max-width:100%; height:auto;" />` : ""}
        `,
        attachments: attachmentUrl
            ? [
                {
                filename: attachmentUrl.split("/").pop(),
                path: attachmentUrl,
                cid: "attached-image",
                },
            ]
            : [],
        });


      // Update recipient status
      const updatedRecipients = broadcast.recipients.map(r =>
        r.email === email ? { ...r, status: "sent" } : r
      );

      broadcast.recipients = updatedRecipients;
      broadcast.status = "sent"; // Optional: set this only if all are sent
      await broadcast.save();

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Resend failed:", err);
      return NextResponse.json({ error: "Failed to resend email", details: err.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Resend failed" }, { status: 500 });
  }
}
