// /api/stats/growth/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Subscriber from "@/models/Subscriber";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // 🔹 1. Fetch current subscribers
    const currentSubscribers = await Subscriber.countDocuments();

    // 🔹 2. Fetch subscribers 30 days ago
    const pastSubscribers = await Subscriber.countDocuments({
      subscribedAt: { $lte: thirtyDaysAgo },
    });

    // 🔹 3. Fetch Clerk users
    const clerkRes = await fetch("https://api.clerk.com/v1/users", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
    });

    if (!clerkRes.ok) {
      const errorText = await clerkRes.text();
      console.error("Clerk error:", errorText);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const users = await clerkRes.json();

    // 🔹 4. Count current users
    const currentUsers = users.length;

    // 🔹 5. Count users created before 30 days ago
    const pastUsers = users.filter((u: any) => {
      const createdAt = u.created_at || u.createdAt;
      return new Date(createdAt) <= thirtyDaysAgo;
    }).length;

    // 🔹 6. Calculate growth %
    const subscriberGrowth =
      pastSubscribers > 0
        ? (((currentSubscribers - pastSubscribers) / pastSubscribers) * 100).toFixed(1)
        : "0.0";

    const userGrowth =
      pastUsers > 0
        ? (((currentUsers - pastUsers) / pastUsers) * 100).toFixed(1)
        : "0.0";

    return NextResponse.json({
      currentUsers,
      currentSubscribers,
      userGrowth,
      subscriberGrowth,
    });
  } catch (err: any) {
    console.error("Growth stats error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
