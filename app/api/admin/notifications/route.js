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

  // 🔔 Send an email if any field is switched ON
  const emailTarget = session.user.email;
  const toggledOn = Object.entries(body)
    .flatMap(([category, fields]) =>
      Object.entries(fields).filter(([, val]) => val).map(([key]) => `${category}.${key}`)
    );

  if (toggledOn.length > 0) {
    await sendEmail({
      to: emailTarget,
      subject: "Your Notification Preferences Updated",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hi ${session.user.name || "there"},</h2>
          <p>The following notification preferences have been enabled:</p>
          <ul>
            ${toggledOn.map((key) => `<li>${key}</li>`).join("")}
          </ul>
          <p>You can update these anytime in your account settings.</p>
          <br />
          <p style="font-size: 12px; color: gray;">— The Shop Team</p>
        </div>
      `,
    });
  }

  return new Response(JSON.stringify(updated), { status: 200 });
}
