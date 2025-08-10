
// app/api/reviews/testimonialapproval/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(req) {
  try {
    await connectDB();

    const { order } = await req.json();
    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { message: "Invalid format. Expected { order: [ {id, position} ] }" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // bulkWrite to save all positions
    const bulkOps = order.map(({ id, position }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position } }
      }
    }));

    if (bulkOps.length > 0) {
      await Review.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/reviews/testimonialapproval error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}




















