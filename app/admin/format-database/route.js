




// /app/api/admin/format-database/route.js
import { auth } from "@clerk/nextjs";
import connectDB from "@/config/db";
import mongoose from "mongoose";
import User from "@/models/User"; // must contain 'role' field

export async function DELETE(req) {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await connectDB();

  const adminUser = await User.findOne({ clerkId: userId, role: "admin" });
  if (!adminUser) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { password } = await req.json();
  const expectedPassword = process.env.ADMIN_DELETE_PASSWORD;
  if (password !== expectedPassword) {
    return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 401 });
  }

  const collections = await mongoose.connection.db.listCollections().toArray();

  for (const { name } of collections) {
    if (name === "users") {
      // Keep only admin users
      await mongoose.connection.db.collection("users").deleteMany({ role: { $ne: "admin" } });
    } else {
      await mongoose.connection.db.collection(name).deleteMany({});
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
