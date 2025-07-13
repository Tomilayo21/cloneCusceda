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

    const recipient = broadcast.recipients.find((r) => r.email === email);
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

    const attachments = (broadcast.attachment || []).map((url, index) => ({
      filename: url.split("/").pop(),
      path: url,
      cid: `attachment-${index}`,
    }));

    const attachmentsHtml = (broadcast.attachment || [])
      .map((url, i) =>
        url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
          ? `<img src="${url}" style="max-width:100%; height:auto;" />`
          : `<p><a href="${url}" target="_blank">View Attachment ${i + 1}</a></p>`
      )
      .join("");

    // Send email
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

    // Update recipient status and time
    await Broadcast.updateOne(
      { _id: id, "recipients.email": email },
      {
        $set: {
          "recipients.$.status": "sent",
          "recipients.$.error": null,
          "recipients.$.sentAt": new Date(), // ✅ Save time of delivery
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend failed:", err);

    // Save failure reason
    await Broadcast.updateOne(
      { _id: id, "recipients.email": email },
      {
        $set: {
          "recipients.$.status": "failed",
          "recipients.$.error": err.message,
        },
      }
    );

    return NextResponse.json({ error: "Failed to resend email", details: err.message }, { status: 500 });
  }
}
