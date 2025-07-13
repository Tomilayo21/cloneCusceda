import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.clerk.com/v1/users", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clerk error:", errorText);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const users = await response.json();

    // Map the user fields here
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      first_name: user.first_name ?? user.firstName ?? null,
      last_name: user.last_name ?? user.lastName ?? null,
      email_addresses: user.email_addresses ?? user.emailAddresses ?? [],
      profile_image_url: user.profile_image_url ?? user.imageUrl ?? "",
      public_metadata: user.public_metadata ?? user.publicMetadata ?? {},
      created_at: user.created_at ?? user.createdAt ?? null,
      updated_at: user.updated_at ?? user.updatedAt ?? null,
      last_sign_in_at: user.last_sign_in_at ?? user.lastSignInAt ?? null,
      external_accounts: user.external_accounts ?? user.externalAccounts ?? [],
      username: user.username ?? null,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
