// scripts/migrateClerkToLocal.js
import fetch from "node-fetch"; // if your Node needs it
import connectDB from "@/config/db";
import User from "@/models/User";

async function run() {
  await connectDB();
  const res = await fetch("https://api.clerk.com/v1/users", {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`},
  });
  const clerkUsers = await res.json();

  for (const cu of clerkUsers) {
    const id = cu.id;
    const existing = await User.findById(id);
    if (existing) {
      console.log("Skipping existing:", id);
      continue;
    }
    await User.create({
      _id: id,
      name: `${cu.first_name ?? ""} ${cu.last_name ?? ""}`.trim() || "NoName",
      username: cu.username ?? `user_${Date.now()}`,
      email: cu.email_addresses?.[0]?.email_address ?? `no-email-${id}@example.com`,
      imageUrl: cu.profile_image_url ?? "",
      role: cu.public_metadata?.role ?? "user",
      emailVerified: true, // Clerk-managed so assume verified
      cartItems: {}
    });
    console.log("Imported:", id);
  }
  console.log("Done");
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1);});
