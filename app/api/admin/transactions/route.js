import { NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/config/db";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Count total number of orders (without pagination)
    const totalCount = await Order.countDocuments();

    // Fetch paginated results
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ transactions: orders, totalCount });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
