import connectDB from '@/config/db';
import Order from '@/models/Order';
import { getAuth } from '@clerk/nextjs/server'; // assuming Clerk
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = getAuth(req); // ✅ Clerk auth
    await connectDB();

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    order.paymentStatus = status;
    await order.save();

    return NextResponse.json({ success: true, message: "Payment status updated", order });
  } catch (err) {
    console.error("API ERROR:", err); // 👈 check logs
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
