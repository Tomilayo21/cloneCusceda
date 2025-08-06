// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import UserSettings from "@/models/UserSettings";

// // GET user settings
// export async function GET(req) {
//   const { userId } = getAuth(req); 
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   await connectDB();

//   const settings = await UserSettings.findOne({ userId });

//   if (!settings) return NextResponse.json({});

//   return NextResponse.json({
//     fontSize: settings.fontSize,
//     layoutStyle: settings.layoutStyle,
//     themeColor: settings.themeColor,
//     themeMode: settings.themeMode,
//     contrastMode: settings.contrastMode,
//   });
// }


// // POST or UPDATE user settings
// export async function POST(req) {
//   const { userId } = getAuth(req);
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const body = await req.json();
//   const {
//     themeColor,
//     themeMode,
//     contrastMode,
//     layoutStyle,
//     fontSize,
//   } = body;

//   await connectDB();

//   const updatedSettings = await UserSettings.findOneAndUpdate(
//     { userId },
//     {
//       $set: {
//         themeColor,
//         themeMode,
//         contrastMode,
//         layoutStyle,
//         fontSize,
//       },
//     },
//     { upsert: true, new: true }
//   );

//   return NextResponse.json(updatedSettings);
// }


























import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import UserSettings from "@/models/UserSettings";

// GET user settings
export async function GET(req) {
  const { userId } = getAuth(req); 
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const settings = await UserSettings.findOne({ userId });

  return NextResponse.json({
    layoutStyle: settings?.layoutStyle || 'default',
    fontSize: settings?.fontSize || 'medium',
  });
}

// PATCH (Update) user settings
export async function PATCH(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { layoutStyle, fontSize } = body;

  await connectDB();

  const updatedSettings = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: { layoutStyle, fontSize } },
    { new: true, upsert: true }
  );

  return NextResponse.json({ success: true });
}
