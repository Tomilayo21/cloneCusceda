import connectDB from "@/config/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/authAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // ✅ Verify admin via NextAuth session
    const adminUser = await requireAdmin(request);

    // If unauthorized or forbidden, requireAdmin() already returns a NextResponse
    if (adminUser instanceof NextResponse) {
      return adminUser;
    }

    // ✅ Connect to database
    await connectDB();

    const { orderId, status } = await request.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
