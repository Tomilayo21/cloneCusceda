// app/api/reviews/route.js
import connectDB from "@/config/db";
import Review from "@/models/Review";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

/**
 * GET: Fetch reviews
 * - If productId query param exists → public, only approved reviews
 * - If no productId → admin only, all reviews
 */
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    let reviews;
    if (productId) {
      // Public: only approved reviews
      reviews = await Review.find({ productId, approved: true })
        .populate("productId", "name")
        .sort({ createdAt: -1 });
    } else {
      // Admin: all reviews
      const admin = await requireAdmin(request);
      if (admin instanceof NextResponse) return admin;

      reviews = await Review.find()
        .populate("productId", "name")
        .sort({ createdAt: -1 });
    }

    const reviewsWithImages = await Promise.all(
      reviews.map(async (review) => {
        const dbUser = await User.findById(review.userId);
        return {
          ...review.toObject(),
          imageUrl: dbUser?.imageUrl || null,
        };
      })
    );

    // Always return an array
    return NextResponse.json(reviewsWithImages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * POST: Submit a new review (user)
 */
export async function POST(request) {
  try {
    await connectDB();

    // Parse body
    const body = await request.json();
    const { productId, rating, comment } = body;

    // Validate body
    if (!productId || rating == null || !comment?.trim()) {
      return NextResponse.json(
        { message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Get session from NextAuth
    const session = await getServerSession({ req: request, ...authOptions });
    const userId = session?.user?.id;
    const username = session?.user?.name || "Anonymous";

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user already submitted review
    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return NextResponse.json(
        { message: "You have already submitted a review" },
        { status: 400 }
      );
    }

    // Save new review
    const review = new Review({
      productId,
      userId,
      username,
      rating: Number(rating),
      comment: comment.trim(),
      approved: false, // admin approval required
    });

    await review.save();

    return NextResponse.json(
      { message: "Review submitted for approval" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Approve a review (admin only)
 */
export async function PATCH(request) {
  try {
    await connectDB();

    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) return admin; // stop if unauthorized

    const { reviewId, approved } = await request.json();
    if (!reviewId || typeof approved !== "boolean") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true });
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete a review (admin only)
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) return admin; // stop if unauthorized

    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ message: "Review ID missing" }, { status: 400 });
    }

    await Review.findByIdAndDelete(reviewId);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
