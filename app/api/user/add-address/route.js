import connectDB from "@/config/db";
import Address from "@/models/Address";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { address } = await req.json();

    await connectDB();

    const newAddress = new Address({ ...address, userId });
    await newAddress.save();

    return NextResponse.json({
      success: true,
      message: "Address saved",
      addressId: newAddress._id, // ✅ Important: return _id
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to save address",
    });
  }
}
