import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { items, address, userId, reference } = await req.json(); 

    if (!userId) return NextResponse.json({ success: false, message: "User ID missing" }, { status: 401 });

    let normalizedItems = [];
    if (Array.isArray(items)) normalizedItems = items;
    else if (items && typeof items === "object") {
      normalizedItems = Object.entries(items).map(([product, quantity]) => ({ product, quantity }));
    } else return NextResponse.json({ success: false, message: "Invalid items format" }, { status: 400 });

    if (!address || normalizedItems.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
    }

    if (reference) {
      const existingOrder = await Order.findOne({ referenceId: reference });
      if (existingOrder) return NextResponse.json({ success: true, order: existingOrder, message: "Order already exists" });
    }

    let totalAmount = 0;
    const orderItems = [];
    for (const { product, quantity } of normalizedItems) {
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
      paymentMethod: "paystack",
      paymentStatus: "Successful",
      orderStatus: "Order Placed",
      referenceId: reference || null,
      date: Date.now(),
    });

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[PAYSTACK_ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
