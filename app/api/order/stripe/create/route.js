// app/api/order/stripe/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import NotificationPreferences from "@/models/NotificationPreferences";
import { sendEmail } from "@/lib/email";

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

    // 🟠 Notify buyer + subscribed admins
      try {
        // 1️⃣ Fetch the buyer’s email
        const buyer = await User.findById(userId);
        const buyerEmail = buyer?.email;
        const buyerName = buyer?.name || "Customer";

        // 2️⃣ Fetch subscribed admins
        const subscribedUsers = await NotificationPreferences.find({
          "orders.newOrder": true,
        }).populate("userId", "email name");

        // Collect admin emails
        const adminEmails = subscribedUsers
          .map(pref => pref.userId?.email)
          .filter(Boolean);

        // 3️⃣ Compose email HTML
        const emailHTML = `
          <p>Hi,</p>
          <p>A new order has just been placed:</p>
          <ul>
            <li><b>Order ID:</b> ${order._id}</li>
            <li><b>Amount:</b> ₦${order.amount.toLocaleString()}</li>
            <li><b>Payment Method:</b> ${order.paymentMethod}</li>
            <li><b>Status:</b> ${order.orderStatus}</li>
          </ul>
          <p>— The Shop Team</p>
        `;

        // 🟣 Check buyer's notification preferences
        const buyerPrefs = await NotificationPreferences.findOne({ userId });
        const buyerWantsEmail = buyerPrefs?.orders?.newOrder ?? true; // default true if not found

        if (buyerEmail && buyerWantsEmail) {
          await sendEmail({
            to: buyerEmail,
            subject: "🧾 Order Confirmation",
            html: `
              <p>Hi ${buyerName},</p>
              <p>Thank you for your order! Here are your details:</p>
              ${emailHTML}
              <p>We'll notify you once it ships.</p>
            `,
          });
          console.log(`✅ Order confirmation sent to buyer: ${buyerEmail}`);
        } else {
          console.log(`🚫 Skipped buyer email — preference disabled`);
        }


        // 5️⃣ Send to all admins (notification)
        for (const email of adminEmails) {
          await sendEmail({
            to: email,
            subject: "🛒 New Order Placed",
            html: `
              <p>Hi Admin,</p>
              ${emailHTML}
            `,
          });
        }

        console.log(
          `✅ Sent new order email to ${adminEmails.length} admin(s) + buyer`
        );
      } catch (emailErr) {
        console.error("❌ Failed to send order notification:", emailErr);
      }



    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[STRIPE_ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
