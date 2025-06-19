import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

let status = "offline"; // in-memory fallback

export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { newStatus } = await req.json();
  status = newStatus;

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status });
}
