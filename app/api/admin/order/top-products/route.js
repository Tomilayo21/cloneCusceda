// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();

//     // Aggregate top products from orders using the price in each order
//     const topProductsAgg = await Order.aggregate([
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: "$items.product",
//           units: { $sum: "$items.quantity" },
//           revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }, // 💡 Use order item price
//         },
//       },
//       { $sort: { units: -1 } },
//       { $limit: 5 },
//     ]);

//     // Fetch product names and stock
//     const finalProducts = await Promise.all(
//       topProductsAgg.map(async (item) => {
//         const product = await Product.findById(item._id).lean();
//         return {
//           product: product?.name || "Unknown",
//           units: item.units,
//           revenue: item.revenue || 0,
//           stock: product?.stock || 0,
//         };
//       })
//     );

//     return NextResponse.json({ success: true, topProducts: finalProducts });
//   } catch (error) {
//     console.error("Failed to fetch top products:", error);
//     return NextResponse.json({ success: false, message: error.message });
//   }
// }
























import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // 🔹 Aggregate top-selling products from DELIVERED or PLACED orders
    const topProductsAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ["Delivered", "Order Placed", "Processing", "Shipped"] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalUnits: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalUnits: -1 } },
      { $limit: 5 },
    ]);

    console.log("📊 Aggregation result:", topProductsAgg);

    if (!topProductsAgg.length) {
      return NextResponse.json({
        success: true,
        topProducts: [],
        message: "No orders found for top products.",
      });
    }

    // 🔹 Fetch product details
    const finalProducts = await Promise.all(
      topProductsAgg.map(async (item) => {
        const product = await Product.findById(item._id).lean();
        return {
          product: product?.name || "Unknown Product",
          units: item.totalUnits,
          revenue: item.totalRevenue || 0,
          stock: product?.stock ?? 0,
        };
      })
    );

    console.log("✅ Final top products:", finalProducts);

    return NextResponse.json({
      success: true,
      topProducts: finalProducts,
    });
  } catch (error) {
    console.error("❌ Failed to fetch top products:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong while fetching top products",
    });
  }
}
