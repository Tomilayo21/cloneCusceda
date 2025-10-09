// /app/api/reviews/route.js
import connectDB from "@/config/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authAdmin from "@/lib/authAdmin";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { productId, rating, comment, username } = await req.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const userId = session.user.id;
    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return NextResponse.json({ message: "You already submitted a review" }, { status: 400 });
    }

    const review = new Review({
      productId,
      userId,
      username,
      rating,
      comment,
      approved: false,
    });

    await review.save();

    return NextResponse.json({ message: "Review submitted for approval" }, { status: 201 });
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await connectDB();

    const { order } = await req.json();
    // order = [{ id: "reviewId", position: 0 }, ...]

    const bulkOps = order.map(({ id, position }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position } },
      },
    }));

    await Review.bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH Review Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
