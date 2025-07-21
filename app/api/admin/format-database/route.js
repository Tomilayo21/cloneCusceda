// import { auth } from "@clerk/nextjs/server";
// import connectDB from "@/config/db";
// import mongoose from "mongoose";

// // Ideally store this securely in an env variable
// const ADMIN_DB_CLEAR_PASSWORD = process.env.ADMIN_DB_CLEAR_PASSWORD;

// export async function DELETE(req) {
//   try {
//     const { userId, sessionClaims } = auth();
//     if (!userId || sessionClaims?.publicMetadata?.role !== "admin") {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
//     }

//     const { password } = await req.json();

//     if (!password || password !== ADMIN_DB_CLEAR_PASSWORD) {
//       return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
//     }

//     await connectDB();
//     await mongoose.connection.db.dropDatabase();

//     return new Response(JSON.stringify({ message: "Database dropped successfully." }), { status: 200 });
//   } catch (err) {
//     console.error("Error dropping DB:", err);
//     return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
//   }
// }
























































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
