import connectDB from "@/config/db";
import authSeller from "@/lib/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import Team from "@/models/Team";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await connectDB();
    const { order } = await request.json(); 

    const bulkOps = order.map(({ id, position }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position } },
      },
    }));

    await Team.bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
