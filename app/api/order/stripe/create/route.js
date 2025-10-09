// // app/api/order/stripe/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { items, address, userId } = await req.json(); 
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID missing" }, { status: 401 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid cart" }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = [];
    for (const { product, quantity } of items) {
      const p = await Product.findById(product);
      if (!p) throw new Error(`Product not found: ${product}`);
      if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);

      const snapshotPrice = p.offerPrice || p.price;
      totalAmount += snapshotPrice * quantity;

      orderItems.push({ product, quantity, price: snapshotPrice });

      p.stock -= quantity;
      await p.save();
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      amount: totalAmount,
      paymentMethod: "stripe",
      paymentStatus: "Successful",
      orderStatus: "Order Placed",
      date: Date.now(),
    });

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[STRIPE_ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
