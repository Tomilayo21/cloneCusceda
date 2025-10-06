// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Product from "@/models/Product";
// import mongoose from "mongoose";
// import { getAuth } from "@clerk/nextjs/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2023-10-16",
// });

// export async function POST(req) {
//   try {
//     await connectDB();

//     // ✅ Get logged-in user
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     const { items, address, paymentMethod } = body;

//     // ✅ Validate cart format
//     if (!items || typeof items !== "object" || Array.isArray(items)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid cart format. Expected { productId: quantity }" },
//         { status: 400 }
//       );
//     }

//     // ✅ Convert cart object → array for later use
//     const itemsArray = Object.entries(items).map(([id, qty]) => ({
//       product: id,
//       quantity: qty,
//     }));

//     // ✅ Validate ObjectIds
//     const validIds = itemsArray
//       .map((item) => item.product)
//       .filter((id) => mongoose.Types.ObjectId.isValid(id));

//     if (validIds.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No valid product IDs in cart" },
//         { status: 400 }
//       );
//     }

//     // ✅ Fetch products from DB
//     const dbProducts = await Product.find({ _id: { $in: validIds } });

//     if (dbProducts.length !== validIds.length) {
//       return NextResponse.json(
//         { success: false, message: "Some products not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ Prepare Stripe line_items
//     const line_items = dbProducts.map((product) => {
//       const quantity = parseInt(items[product._id.toString()]);
//       const price = product.offerPrice;

//       if (!quantity || quantity <= 0) {
//         throw new Error(`Invalid quantity for product: ${product.name}`);
//       }

//       const imageUrl =
//         product.image?.[0]?.startsWith("https")
//           ? product.image[0]
//           : "https://via.placeholder.com/300";

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name || "Unnamed Product",
//             images: [imageUrl],
//           },
//           unit_amount: Math.round(price * 100), // Stripe requires cents
//         },
//         quantity,
//       };
//     });

//     // ✅ Get domain (local fallback)
//     const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

//     // ✅ Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${domain}/cart`,
//       metadata: {
//         userId, // 👈 important for webhook
//         address: JSON.stringify(address || {}),
//         paymentMethod: paymentMethod || "card",
//         items: JSON.stringify(itemsArray),
//       },
//     });

//     return NextResponse.json({ success: true, url: session.url });
//   } catch (error) {
//     console.error("[CHECKOUT_ERROR]", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }


















































import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { items, address, userId, paymentMethod } = body;

    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (!items || typeof items !== "object") return NextResponse.json({ success: false, message: "Invalid cart" }, { status: 400 });

    const itemsArray = Object.entries(items).map(([id, qty]) => ({ product: id, quantity: qty }));

    const validIds = itemsArray.map(i => i.product).filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) return NextResponse.json({ success: false, message: "No valid product IDs" }, { status: 400 });

    const dbProducts = await Product.find({ _id: { $in: validIds } });
    if (!dbProducts.length) return NextResponse.json({ success: false, message: "Products not found" }, { status: 404 });

    const line_items = dbProducts.map(product => {
      const quantity = parseInt(items[product._id.toString()]);
      return {
        price_data: {
          currency: "usd",
          product_data: { name: product.name, images: [product.image?.[0] || "https://via.placeholder.com/300"] },
          unit_amount: Math.round((product.offerPrice || product.price) * 100),
        },
        quantity,
      };
    });

    const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cart`,
      metadata: { userId, address: JSON.stringify(address || {}), paymentMethod: paymentMethod || "card", items: JSON.stringify(itemsArray) },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error("[CHECKOUT_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
