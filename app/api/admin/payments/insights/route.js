import { NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/config/db";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30";

    const dateFilter =
      range !== "all"
        ? { createdAt: { $gte: new Date(Date.now() - Number(range) * 24 * 60 * 60 * 1000) } }
        : {};

    const data = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$paymentMethod",
          value: { $sum: 1 }, // ✅ Count number of orders per payment method
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Payment Insights API Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
