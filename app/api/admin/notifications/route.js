import { getServerSession } from "next-auth";
import connectDB from "@/config/db";
import NotificationPreferences from "@/models/NotificationPreferences";
import { sendEmail } from "@/lib/email";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let prefs = await NotificationPreferences.findOne({ userId: session.user.id });
  if (!prefs) {
    prefs = await NotificationPreferences.create({ userId: session.user.id });
  }

  return new Response(JSON.stringify(prefs), { status: 200 });
}

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();

  const updated = await NotificationPreferences.findOneAndUpdate(
    { userId: session.user.id },
    { $set: body },
    { new: true, upsert: true }
  );

  return new Response(JSON.stringify(updated), { status: 200 });
}
