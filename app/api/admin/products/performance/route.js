// app/api/admin/products/performance/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30";

    // build date filter
    let dateFilter = {};
    if (range !== "all") {
      const days = parseInt(range, 10) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      dateFilter = { createdAt: { $gte: since } };
    }

    // match statuses (completed/placed/processing/shipped)
    const ORDERS_MATCH = {
      orderStatus: { $in: ["Delivered", "Order Placed", "Processing", "Shipped"] },
      ...dateFilter,
    };

    // aggregate units sold and revenue per product id
    const agg = await Order.aggregate([
      { $match: ORDERS_MATCH },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalUnits: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalUnits: -1 } },
      { $limit: 20 }, // server-side cap
    ]);

    if (!agg || agg.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // fetch product details for the aggregated product ids
    const productIds = agg.map((a) => a._id);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // map product details into aggregation result
    const productMap = products.reduce((acc, p) => {
      acc[String(p._id)] = p;
      return acc;
    }, {});

    const result = agg.map((item) => {
      const prod = productMap[String(item._id)];
      return {
        id: String(item._id),
        name: prod?.name || "Unknown Product",
        sales: item.totalUnits || 0,
        revenue: item.totalRevenue || 0,
        image: Array.isArray(prod?.image) && prod.image.length > 0 ? prod.image[0] : null,
      };
    });

    // sort again (defensive) and return
    const sorted = result.sort((a, b) => b.sales - a.sales);

    return NextResponse.json({ success: true, data: sorted }, { status: 200 });
  } catch (err) {
    console.error("Performance API error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
