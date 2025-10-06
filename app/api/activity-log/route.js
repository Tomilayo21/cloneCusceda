// import { NextResponse } from 'next/server';
// import connectDB from '@/config/db';
// import ActivityLog from '@/models/ActivityLog';

// export async function GET() {
//   try {
//     await connectDB();
//     const logs = await ActivityLog.find().sort({ timestamp: -1 });
//     return NextResponse.json(logs);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to load activity logs' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     await connectDB();
//     const { action, detail } = await request.json();

//     if (!action || !detail) {
//       return NextResponse.json({ error: 'Missing action or detail' }, { status: 400 });
//     }

//     await ActivityLog.create({ action, detail });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
//   }
// }




































// app/api/activity-log/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // optional filter
    const query = type ? { type } : {};

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(500); // limit for performance

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load activity logs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { type, action, entityId, userId, changes } = await req.json();

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const log = await ActivityLog.create({ type, action, entityId, userId, changes });
    return NextResponse.json({ success: true, log });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
