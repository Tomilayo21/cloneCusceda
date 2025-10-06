// //lib/authAdmin.js
// import { clerkClient } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// const authAdmin = async (userId) => {
//     try {

//         const client = await clerkClient()
//         const user = await client.users.getUser(userId)

//         if (user.publicMetadata.role === 'admin') {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message });
//     }
// }

// export default authAdmin;


























// lib/authAdmin.js
import { NextResponse } from "next/server";
import { getUserFromRequest } from "./verifyToken";

/**
 * Use inside your route handlers to enforce admin access.
 * Returns the admin user object if authorized, otherwise returns a NextResponse that you should return to client.
 */
export async function requireAdmin(req) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin")
    return NextResponse.json({ error: "Forbidden - admin access required" }, { status: 403 });
  return user;
}
