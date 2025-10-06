// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { userId } = getAuth(request);
//     if (!userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
//     }

//     await connectDB();
//     const { orderId } = await request.json();

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
//     }

//     if (order.userId !== userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
//     }

//     if (order.status !== "Cancelled") {
//       return NextResponse.json({ success: false, message: "Only cancelled orders can be deleted" }, { status: 400 });
//     }

//     await order.deleteOne();
//     return NextResponse.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }







































import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    // Extract userId from Authorization header
    const authHeader = request.headers.get("Authorization") || "";
    const userId = authHeader.replace("Bearer ", "").trim();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "No order ID provided" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (order.orderStatus !== "Cancelled") {
      return NextResponse.json(
        { success: false, message: "Only cancelled orders can be deleted" },
        { status: 400 }
      );
    }

    await order.deleteOne();

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
