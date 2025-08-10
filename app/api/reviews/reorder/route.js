// /pages/api/reviews/index.js (or /app/api/reviews/route.js in app router)
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/lib/authAdmin";
import Review from "@/models/Review"; // Your mongoose model for reviews
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    const { productId, rating, comment, username } = await request.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return NextResponse.json({ message: 'You already submitted a review' }, { status: 400 });
    }

    const review = new Review({ productId, userId, username, rating, comment, approved: false });
    await review.save();

    return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await connectDB();

    const { order } = await request.json(); 
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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
