import connectDB from "@/config/db";
import Reply from "@/models/Reply";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { to, cc, subject, message, originalMessageId } = body;

  if (!to || !subject || !message || !originalMessageId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const reply = await Reply.create({ to, cc, subject, message, originalMessageId });

  // ✅ Yahoo Mail SMTP setup
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Cusceda NG" <${process.env.EMAIL_USER}>`,
      to,
      cc,
      subject,
      text: message,
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId");

  if (messageId) {
    const replies = await Reply.find({ originalMessageId: messageId }).sort({ sentAt: -1 });
    return NextResponse.json({ replies });
  }

  // Return all replies if no messageId is provided (for "Replies" tab)
  const replies = await Reply.find().sort({ sentAt: -1 });
  return NextResponse.json({ replies });
}


export async function PATCH(req) {
  await connectDB();
  const { replyId, status } = await req.json();

  if (!replyId || !["active", "deleted"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const reply = await Reply.findByIdAndUpdate(replyId, { status }, { new: true });

  if (!reply) {
    return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, reply });
}
