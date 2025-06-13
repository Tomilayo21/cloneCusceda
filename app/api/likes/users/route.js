import { users } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { userIds } = body;

    if (!Array.isArray(userIds)) {
      return NextResponse.json({ success: false, message: "Invalid userIds array" }, { status: 400 });
    }

    const userDetails = await Promise.all(
      userIds.map(id =>
        users.getUser(id).catch(err => {
          console.error(`Failed to fetch user ${id}:`, err);
          return null;
        })
      )
    );

    const filtered = userDetails
      .filter(Boolean)
      .map(u => ({
        id: u.id,
        fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Anonymous',
        email: u.emailAddresses?.[0]?.emailAddress || '',
        image: u.imageUrl || '',
        username: u.username || '',
        createdAt: u.createdAt,
      }));

    return NextResponse.json({ success: true, users: filtered });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch user data' }, { status: 500 });
  }
}
