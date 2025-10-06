import connectDB from "@/config/db";
import User from "@/models/User"; // your Mongoose User model
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB(); // make sure MongoDB is connected

    const allUsers = await User.find({}, { createdAt: 1 }).lean();

    const allCustomers = allUsers.length;

    // Count new users in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newCustomers = allUsers.filter(
      (u) => u.createdAt && u.createdAt >= sevenDaysAgo
    ).length;

    return NextResponse.json({
      success: true,
      allCustomers,
      newCustomers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

















// // app/api/customers/route.js
// export const runtime = "nodejs"; // ensure Node.js runtime, not Edge

// import connectDB from "@/config/db";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB(); // connect to MongoDB

//     // Get all users
//     const allUsers = await User.find({}, { createdAt: 1 }).lean();
//     const allCustomers = allUsers.length;

//     // Calculate new customers from the last 7 days
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const newCustomers = allUsers.filter(
//       (u) => u.createdAt && u.createdAt >= sevenDaysAgo
//     ).length;

//     return NextResponse.json({
//       success: true,
//       allCustomers,
//       newCustomers,
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
