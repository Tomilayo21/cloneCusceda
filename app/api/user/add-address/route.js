// import connectDB from "@/config/db";
// import Address from "@/models/Address";
// import { NextResponse } from "next/server";
// import { getAuth } from "@clerk/nextjs/server";

// export async function POST(req) {
//   try {
//     const { userId } = getAuth(req);
//     const { address } = await req.json();

//     await connectDB();

//     const newAddress = new Address({ ...address, userId });
//     await newAddress.save();

//     return NextResponse.json({
//       success: true,
//       message: "Address saved",
//       addressId: newAddress._id, // ✅ Important: return _id
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to save address",
//     });
//   }
// }


















// import connectDB from "@/config/db";
// import Address from "@/models/Address";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     const { address } = await req.json();

//     // 1️⃣ Get token from Authorization header
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) throw new Error("Authorization token missing");

//     const token = authHeader.replace("Bearer ", "");
//     if (!token) throw new Error("Authorization token missing");

//     // 2️⃣ Verify JWT (adjust secret to match your auth setup)
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;
//     if (!userId) throw new Error("Invalid token: user ID missing");

//     // 3️⃣ Connect to DB and save address
//     await connectDB();

//     const newAddress = new Address({ ...address, userId });
//     await newAddress.save();

//     return NextResponse.json({
//       success: true,
//       message: "Address saved",
//       addressId: newAddress._id,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to save address",
//     });
//   }
// }

































import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/config/db";
import Address from "@/models/Address";

export async function POST(req) {
  try {
    // ✅ Get authenticated user session via NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const { address } = await req.json();
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address data is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Save address linked to authenticated user
    const newAddress = new Address({
      ...address,
      userId: session.user.id,
    });
    await newAddress.save();

    return NextResponse.json({
      success: true,
      message: "Address saved successfully",
      addressId: newAddress._id,
    });
  } catch (error) {
    console.error("Address save error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save address" },
      { status: 500 }
    );
  }
}
