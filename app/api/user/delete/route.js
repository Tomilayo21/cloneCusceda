import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // remove cloud image
  if (user.imagePublicId) {
    await cloudinary.v2.uploader.destroy(user.imagePublicId);
  }

  await User.deleteOne({ _id: user._id });

  return NextResponse.json({ ok: true });
}
