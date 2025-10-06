// scripts/createAdminSeed.js
import connectDB from "@/config/db";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth"; // or create a password hash manually

async function run() {
  await connectDB();
  const exists = await User.findOne({ email: "admin@yourdomain.com" });
  if (exists) {
    console.log("Admin already exists:", exists._id);
    process.exit(0);
  }

  const pw = "StrongAdminPassword123!"; // change this and keep it secure
  const pwHash = await hashPassword(pw);
  const admin = await User.create({
    _id: Date.now().toString(),
    name: "Super Admin",
    username: "admin",
    email: "admin@yourdomain.com",
    passwordHash: pwHash,
    role: "admin",
    emailVerified: true
  });

  console.log("Created admin:", admin._id, "password:", pw);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
