import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Subscriber from "@/models/Subscriber";



export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already subscribed." }, { status: 409 });
    }

    await Subscriber.create({ email });
    await sendConfirmationEmail(email);

    return NextResponse.json({ message: "Subscription successful!" }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
