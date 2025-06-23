import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { items } = body;

    if (!items || typeof items !== "object") {
      throw new Error("❌ Invalid cart format");
    }

    // Filter valid ObjectId strings
    const itemIds = Object.keys(items).filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (itemIds.length === 0) {
      throw new Error("❌ No valid product IDs in cart");
    }

    // Fetch full product info
    const dbProducts = await Product.find({ _id: { $in: itemIds } });

    const line_items = dbProducts.map((product) => {
      const quantity = items[product._id.toString()];
      if (!quantity || quantity <= 0) {
        throw new Error(`❌ Invalid quantity for product: ${product.name}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image?.[0] || "https://via.placeholder.com/300"],
          },
          unit_amount: Math.round(product.offerPrice * 100),
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/order-placed",
      cancel_url: "http://localhost:3000/cart",
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
