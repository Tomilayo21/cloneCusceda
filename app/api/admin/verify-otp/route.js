import { NextResponse } from 'next/server';
import Otp from '@/models/Otp';
import connectDB from '@/config/db';

export async function POST(req) {
  await connectDB();
  const { email, otp } = await req.json();

  const record = await Otp.findOne({ email });
  if (!record || record.otp !== otp || record.expiresAt < new Date()) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await Otp.deleteOne({ email }); // Invalidate after success

  return NextResponse.json({ success: true });
}
