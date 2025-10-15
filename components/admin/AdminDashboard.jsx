"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  DollarSign,
  TrendingUp,
  Rocket,
  FileBarChart,
  CreditCard,
  UserCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import MiniChart from "./settings/charts/MiniChart";
import DashboardChart from "./settings/charts/DashboardChart";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsDashboard from "./AnalyticsDashboard";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function AdminDashboard({
  setActiveView,
  setActiveTab,
  setUserPanel,
  setOrderPanel,
}) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || session?.user?.token;
  const { currency } = useAppContext();

  const [userCount, setUserCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [statsData, setStats] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyTrendData, setDailyTrendData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [todayTransactionCount, setTodayTransactionCount] = useState(0);
  const [yesterdayTransactionCount, setYesterdayTransactionCount] = useState(0);
  const [thisMonthTransactionCount, setThisMonthTransactionCount] = useState(0);
  const [showIcons, setShowIcons] = useState(true);
  const [todayDeposit, setTodayDeposit] = useState(0);
  const [yesterdayDeposit, setYesterdayDeposit] = useState(0);
  const [prevMonthTotal, setPrevMonthTotal] = useState(0);
  const [prevMonthCount, setPrevMonthCount] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allCustomers, setAllCustomers] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);

  // === Customers ===
  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();

        if (data.success) {
          setAllCustomers(data.allCustomers ?? 0);
          setNewCustomers(data.newCustomers ?? 0);
        } else {
          console.error("Failed to fetch counts:", data.error);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchUserCounts();
  }, []);

  // === Subscribers ===
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/admin/subscribers");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSubscriberCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch subscribers", err);
      }
    };
    fetchSubscribers();
  }, []);

  // === Stats ===
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats/growth");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  // === Deposit Stats ===
  useEffect(() => {
    const fetchDepositStats = async () => {
      try {
        const res = await fetch("/api/admin/transactions?page=1&limit=1");
        const data = await res.json();

        setTotalDeposit(data.totalAmount || 0);
        setDailyTotal(data.last24HoursAmount || 0);
        setDailyTrendData(data.dailyTrend || []);
        setMonthlyTrendData(data.monthlyTrend || []);
        setTodayTransactionCount(data.todayCount || 0);
        setYesterdayTransactionCount(data.yesterdayCount || 0);
        setThisMonthTransactionCount(data.thisMonthCount || 0);
        setTodayDeposit(data.todayAmount || 0);
        setYesterdayDeposit(data.yesterdayAmount || 0);
        setPrevMonthTotal(data.prevMonthTotal || 0);
        setPrevMonthCount(data.prevMonthCount || 0);

        // ✅ Sum up all totals for this month
        const monthTotal = Array.isArray(data.monthlyTrend)
          ? data.monthlyTrend.reduce((sum, day) => sum + (day.total || 0), 0)
          : 0;
        setThisMonthTotal(monthTotal);
      } catch (error) {
        console.error("Failed to fetch deposit stats", error);
      }
    };

    fetchDepositStats();
  }, []);

  // === Orders ===
  const fetchAdminOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/admin-orders?limit=5&page=1");

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchAdminOrders();
    }
  }, [session?.user]);

  // === Top Products ===
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const { data } = await axios.get("/api/admin/order/top-products");
        if (data.success) {
          setTopProducts(data.topProducts);
        } else {
          toast.error(data.message || "No products found");
        }
      } catch (err) {
        console.error("Error fetching top products:", err);
        toast.error("Failed to load top products");
      }
    };

    fetchTopProducts();
  }, []);

  useEffect(() => {
    console.log("🧾 AdminDashboard Token:", token);
  }, [token]);

  // === Growth % ===
  const projectGrowth =
    prevMonthTotal > 0
      ? (((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100).toFixed(1)
      : thisMonthTotal > 0
      ? "100.0"
      : "0.0";

  // === Dashboard Stats ===
  const stats = [
    {
      title: "Total Sales",
      value: `${currency}${totalDeposit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <DollarSign className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Total Orders",
      value: thisMonthTransactionCount.toString(),
      icon: <CreditCard className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Total Customers",
      value: allCustomers.toString(),
      icon: <Users className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "New Customers",
      value: newCustomers.toString(),
      icon: <Users className="w-6 h-6 text-orange-600" />,
    },
    {
      title: "Conversion",
      value: `${(
        (thisMonthTransactionCount / Math.max(userCount, 1)) *
        100
      ).toFixed(1)}%`,
      icon: <TrendingUp className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Avg. Order Value",
      value:
        thisMonthTransactionCount > 0
          ? `${currency}${(thisMonthTotal / thisMonthTransactionCount).toFixed(
              2
            )}`
          : `${currency}0.00`,
      icon: <FileBarChart className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Subscribers",
      value: subscriberCount.toString(),
      icon: <UserCheck className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Monthly Growth %",
      value: `${projectGrowth}%`,
      icon: <Rocket className="w-6 h-6 text-gray-600" />,
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6">
        {/* Header */}
        <AdminHeader />

        {/* Icon Toggle */}
        <button
          onClick={() => setShowIcons(!showIcons)}
          className="mb-4 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
        >
          {showIcons ? (
            <>
              <EyeOff className="w-4 h-4 text-gray-500" />
              <span>Hide Icons</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-gray-500" />
              <span>Show Icons</span>
            </>
          )}
        </button>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              {/* Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Top Section (Icon) */}
              <div className="flex items-center justify-between mb-4">
                {showIcons && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {item.title}
              </h3>

              {/* Value */}
              <p className="text-xl font-normal text-gray-900 dark:text-white leading-tight">
                {item.value}
              </p>

              {/* Optional Subtext or Percentage */}
              {item.change && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    item.change > 0
                      ? "text-green-600"
                      : item.change < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.change > 0 ? "▲" : item.change < 0 ? "▼" : "•"}{" "}
                  {Math.abs(item.change)}%
                </p>
              )}
            </div>
          ))}
        </div>


        {/* Bottom Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {stats.slice(3).map((item, idx) => (
            <div
              key={idx}
              className={`group relative bg-white dark:bg-gray-900 p-6 rounded-md shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 ${
                idx === 0 ? "sm:col-span-2" : "sm:col-span-1"
              }`}
            >
              {/* Accent bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon */}
              {showIcons && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                </div>
              )}

              {/* Text */}
              <div className="flex flex-col">
                <h3 className="text-sm font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {item.title}
                </h3>
                <p className="text-xl font-normal text-gray-900 dark:text-white leading-tight">
                  {item.value}
                </p>

                {/* Optional subtext or percentage */}
                {item.change && (
                  <p
                    className={`mt-2 text-sm font-medium ${
                      item.change > 0
                        ? "text-green-600"
                        : item.change < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.change > 0 ? "▲" : item.change < 0 ? "▼" : "•"}{" "}
                    {Math.abs(item.change)}%
                  </p>
                )}

                {/* Chart (if any) */}
                {item.chart && (
                  <div className="mt-5">
                    <MiniChart data={dailyTrendData} color="#f97316" /> {/* Orange accent */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div className="space-y-8 mt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-normal text-gray-900">
                Top Products
              </h1>
              <p className="text-gray-500 text-sm font-light sm:text-base mt-1">
                Track your best-selling items and revenue performance.
              </p>
            </div>
            {topProducts.length > 0 && (
              <button className="px-4 py-2 mt-3 sm:mt-0 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition">
                View All
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {topProducts.length > 0 ? (
              topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
                >
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-normal text-gray-900 dark:text-gray-100 truncate">
                        {p.product}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Product ID: #{p.id || idx + 1}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-light px-2.5 py-1 rounded-md ${
                        p.stock > 20
                          ? "bg-green-100 text-black"
                          : p.stock > 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-black"
                      }`}
                    >
                      {p.stock} left
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Units Sold</p>
                      <p className="text-xl font-normal text-gray-900 dark:text-gray-100">
                        {p.units}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-xl font-normal text-gray-900 dark:text-gray-100">
                        {currency}
                        {Number(p.revenue).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((p.units / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-10">
                No products found.
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-6 mt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal text-gray-900">
                Recent Orders
              </h1>
              <p className="text-gray-500 text-sm font-light sm:text-base mt-1">
                Track your latest orders, statuses, and payment progress.
              </p>
            </div>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-normal mt-3 sm:mt-0 transition">
              View All Orders →
            </button>
          </div>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {orders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition"
                    >
                      {/* Customer Info */}
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-medium uppercase">
                          {order.address?.fullName
                            ? order.address.fullName.charAt(0)
                            : "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.address?.fullName || order.fullName || "N/A"}
                          </p>
                          <p className="text-xs font-thin text-gray-500 truncate">
                            {order.orderId || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="min-w-[100px]">
                        <p className="text-sm font-normal text-gray-500">Amount</p>
                        <p className="font-thin text-gray-800">
                          {order.amount
                            ? `${currency}${order.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : "N/A"}
                        </p>
                      </div>

                      {/* Order Status */}
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-500">Order</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full
                            ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "Pending"
                                ? "bg-orange-100 text-orange-700"
                                : order.orderStatus === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-500"
                                : order.orderStatus === "Pending"
                                ? "bg-orange-500"
                                : order.orderStatus === "Cancelled"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {order.orderStatus || "N/A"}
                        </span>
                      </div>

                      {/* Payment Status */}
                      <div className="min-w-[130px]">
                        <p className="text-sm text-gray-500">Payment</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full
                            ${
                              order.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : order.paymentStatus === "Pending"
                                ? "bg-orange-100 text-orange-700"
                                : order.paymentStatus === "Failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.paymentStatus === "Successful"
                                ? "bg-green-500"
                                : order.paymentStatus === "Pending"
                                ? "bg-orange-500"
                                : order.paymentStatus === "Failed"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {order.paymentStatus || "N/A"}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="min-w-[120px] text-right">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-thin text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No orders available.</p>
          )}
        </div>


        {/* Sales Overview */}
        <div className="space-y-4 mt-8">
          <h1 className="text-2xl font-normal text-gray-800">Sales Overview</h1>
          <p className="text-gray-600 font-light">
            Track total orders and revenue across different time ranges.
          </p>
        </div>

        <div className="mt-8 bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <AnimatePresence>
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <DashboardChart
                dailyTrend={dailyTrendData}
                monthlyTrend={monthlyTrendData}
              />
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
