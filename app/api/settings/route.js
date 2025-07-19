// import { connectDB } from "@/config/db";
import connectDB from "@/config/db";
import Settings from "@/models/Settings";

export async function GET() {
  await connectDB();
  const settings = await Settings.findOne({});
  return Response.json({ logoUrl: settings?.logoUrl || null });
}
