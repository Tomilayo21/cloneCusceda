import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import ActivityLog from '@/models/ActivityLog';

export async function GET() {
  try {
    await connectDB();
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load activity logs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { action, detail } = await request.json();

    if (!action || !detail) {
      return NextResponse.json({ error: 'Missing action or detail' }, { status: 400 });
    }

    await ActivityLog.create({ action, detail });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
