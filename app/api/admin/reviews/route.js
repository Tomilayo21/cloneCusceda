import connectDB from "@/config/db";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/authAdmin";
import { NextResponse } from "next/server";

// ✅ PATCH — approve or unapprove a review
export async function PATCH(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) return admin; // means not authorized

    await connectDB();

    const { reviewId, approved } = await request.json();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { approved },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("PATCH /reviews error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ DELETE — delete a review
export async function DELETE(request) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) return admin; // not authorized

    await connectDB();

    const { reviewId } = await request.json();

    const deleted = await Review.findByIdAndDelete(reviewId);

    if (!deleted) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /reviews error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
