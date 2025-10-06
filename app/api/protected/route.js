// app/api/protected/route.js
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, user });
}
