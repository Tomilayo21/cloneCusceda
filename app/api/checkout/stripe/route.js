import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectDB();

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, address, paymentMethod } = body;

    // ✅ Validate items is an object with productId: quantity
    if (!items || typeof items !== "object" || Array.isArray(items)) {
      throw new Error("❌ Invalid cart format. Expected object with productId: quantity");
    }

    // ✅ Convert to array for metadata storage and future use
    const itemsArray = Object.keys(items).map(id => ({
      product: id,
      quantity: items[id],
    }));

    const itemIds = Object.keys(items).filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (itemIds.length === 0) {
      throw new Error("❌ No valid product IDs in cart");
    }

    const dbProducts = await Product.find({ _id: { $in: itemIds } });

    if (dbProducts.length !== itemIds.length) {
      throw new Error("❌ Some products were not found in the database");
    }

    const line_items = dbProducts.map((product) => {
      const quantity = parseInt(items[product._id.toString()]);
      const price = product.offerPrice;

      if (!quantity || quantity <= 0) {
        throw new Error(`❌ Invalid quantity for product: ${product.name}`);
      }

      const imageUrl = (product.image?.[0] || "").startsWith("https")
        ? product.image[0]
        : "https://via.placeholder.com/300";

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name || "Unnamed Product",
            images: [imageUrl],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cart`,
      metadata: {
        address: JSON.stringify(address),
        paymentMethod,
        items: JSON.stringify(itemsArray), // ✅ Store as array
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE CHECKOUT ERROR]", error);
    return NextResponse.json(
      { error: "Stripe Checkout failed: " + error.message },
      { status: 500 }
    );
  }
}

