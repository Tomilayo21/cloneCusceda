import connectDB from "@/config/db";
import NotificationPreferences from "@/models/NotificationPreferences";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, orderId, status, buyerEmail, buyerName } = await request.json();

    await connectDB();

    // ✅ Get user preferences
    const prefs = await NotificationPreferences.findOne({ userId });
    if (!prefs) {
      return NextResponse.json({ success: true, message: "No preferences found (skipped email)" });
    }

    // ✅ Check if this email type is enabled
    const wantsShippedEmail = prefs.orders?.shipped ?? true;
    const wantsDeliveredEmail = prefs.orders?.delivered ?? true;

    let subject = "";
    let body = "";

    if (status === "Shipped" && wantsShippedEmail) {
      subject = "📦 Your Order Has Been Shipped!";
      body = `<p>Hi ${buyerName},</p>
              <p>Your order <b>${orderId}</b> has been shipped.</p>`;
    }

    if (status === "Delivered" && wantsDeliveredEmail) {
      subject = "🎉 Your Order Has Been Delivered!";
      body = `<p>Hi ${buyerName},</p>
              <p>Your order <b>${orderId}</b> has been delivered successfully.</p>`;
    }

    if (!subject) {
      return NextResponse.json({ success: true, message: "Email skipped due to preferences" });
    }

    await sendEmail({
      to: buyerEmail,
      subject,
      html: body,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Failed to send notification:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
