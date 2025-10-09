// app/api/admin/transactions/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    // ✅ Admin authentication check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const now = new Date();

    // 🕒 Define date ranges
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 📊 General counts
    const totalCount = await Order.countDocuments();
    const last7DaysCount = await Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const thisMonthCount = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // 💰 Total revenue
    const totalAmountResult = await Order.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalAmount = totalAmountResult[0]?.totalAmount || 0;

    // 💵 Revenue for time periods
    const aggregateTotal = async (gte, lt = new Date()) => {
      const res = await Order.aggregate([
        { $match: { createdAt: lt ? { $gte: gte, $lt: lt } : { $gte: gte } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      return res[0]?.total || 0;
    };

    const last24HoursAmount = await aggregateTotal(oneDayAgo);
    const last7DaysAmount = await aggregateTotal(sevenDaysAgo);
    const last30DaysAmount = await aggregateTotal(thirtyDaysAgo);

    // 🧮 Today vs Yesterday
    const todayCount = await Order.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const yesterdayCount = await Order.countDocuments({
      createdAt: { $gte: twoDaysAgo, $lt: oneDayAgo },
    });

    const todayAmount = await aggregateTotal(oneDayAgo);
    const yesterdayAmount = await aggregateTotal(twoDaysAgo, oneDayAgo);

    // 📈 Daily trend (last 7 days)
    const dailyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const pad = (n) => String(n).padStart(2, "0");

    const dailyTrend = dailyStats.map((entry) => ({
      date: `${entry._id.year}-${pad(entry._id.month)}-${pad(entry._id.day)}`,
      total: entry.total,
    }));

    // 📆 Monthly trend (for graph)
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const monthlyMap = new Map(
      monthlyStats.map((entry) => {
        const y = entry._id.year;
        const m = pad(entry._id.month);
        const d = pad(entry._id.day);
        return [`${y}-${m}-${d}`, entry.total];
      })
    );

    const monthlyTrend = [];
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const key = `${y}-${m}-${day}`;
      monthlyTrend.push({ date: key, total: monthlyMap.get(key) || 0 });
    }

    // 📊 Previous month comparison
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const prevMonthStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfPrevMonth, $lt: endOfPrevMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const prevMonthTotal = prevMonthStats[0]?.total || 0;
    const prevMonthCount = await Order.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lt: endOfPrevMonth },
    });

    // 🧾 Paginated orders with user info
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        model: User,
        select: "username email",
      })
      .lean();

    // ✅ Return analytics + orders
    return NextResponse.json(
      {
        success: true,
        transactions: orders,
        totalCount,
        last7DaysCount,
        thisMonthCount,
        totalAmount,
        last7DaysAmount,
        last30DaysAmount,
        last24HoursAmount,
        todayCount,
        yesterdayCount,
        todayAmount,
        yesterdayAmount,
        prevMonthTotal,
        prevMonthCount,
        dailyTrend,
        monthlyTrend,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
