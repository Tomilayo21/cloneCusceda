// /app/api/current-user/route.js
import { auth } from "@clerk/nextjs";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response(JSON.stringify({}), { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: userId });
  if (!user) return new Response(JSON.stringify({}), { status: 404 });

  return new Response(JSON.stringify({ role: user.role }), { status: 200 });
}
