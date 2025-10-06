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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="group bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                {showIcons && (
                  <span className="text-2xl text-gray-600 group-hover:text-blue-600 transition">
                    {item.icon}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.slice(3).map((item, idx) => (
            <div
              key={idx}
              className={`group bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 ${
                idx === 0 ? "sm:col-span-2" : "sm:col-span-1"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                {showIcons && (
                  <span className="text-2xl text-gray-600 group-hover:text-blue-600 transition">
                    {item.icon}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {item.title}
                </h3>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                {item.chart && (
                  <div className="mt-3">
                    <MiniChart data={dailyTrendData} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div className="space-y-6 mt-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Top Products
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              See which products generate the most revenue and sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProducts.length > 0 ? (
              topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                      {p.product}
                    </h2>
                    <span className="text-sm font-medium text-gray-500">
                      {p.stock} left
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-gray-500">Units Sold</p>
                      <p className="text-lg font-bold text-gray-800">
                        {p.units}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-lg font-bold text-gray-800">
                        {currency}
                        {Number(p.revenue).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((p.units / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No products found.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-6 mt-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Recent Orders
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Track your latest orders and payment statuses.
            </p>
          </div>

          {orders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-800">
                          {order.address?.fullName || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-gray-800">
                          {order.amount
                            ? `${currency}${order.amount.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Order Status</p>
                        <span
                          className={`font-medium ${
                            order.orderStatus === "Delivered"
                              ? "text-green-600"
                              : order.orderStatus === "Pending"
                              ? "text-orange-500"
                              : order.orderStatus === "Cancelled"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {order.orderStatus || "N/A"}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <span
                          className={`font-medium ${
                            order.paymentStatus === "Paid"
                              ? "text-green-600"
                              : order.paymentStatus === "Pending"
                              ? "text-orange-500"
                              : order.paymentStatus === "Failed"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {order.paymentStatus || "N/A"}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders available.</p>
          )}
        </div>

        {/* Sales Overview */}
        <div className="space-y-4 mt-8">
          <h1 className="text-2xl font-bold text-gray-800">Sales Overview</h1>
          <p className="text-gray-600">
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
