"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import moment from "moment";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const FILTERS = [
  { label: "Today", value: "1" },
  { label: "This Week", value: "7" },
  { label: "This Month", value: "30" },
];

export default function SalesDashboard() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || session?.user?.token;

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    dailyOrders: [],
    dailyRevenue: [],
  });
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("7");
  const [mode, setMode] = useState("comparison"); // orders | revenue | comparison
  const [showMore, setShowMore] = useState(true); // set true so chart shows initially

  const { currency } = useAppContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log(`📅 Fetching stats for range: ${range}`);
        const res = await axios.get(`/api/order/transactions?range=${range}`);
        console.log("📊 API Response:", res.data);

        if (res.data.success) {
          setStats({
            totalOrders: res.data.totalOrders,
            totalRevenue: res.data.totalRevenue,
            dailyOrders: res.data.dailyOrders,
            dailyRevenue: res.data.dailyRevenue,
          });
        } else {
          toast.error("Failed to load stats");
        }
      } catch (err) {
        console.error("❌ Fetch Stats Error:", err);
        toast.error("Error fetching stats");
      }
    };

    fetchStats();
  }, [range]);


  // 🧮 Combine dailyOrders + dailyRevenue
  const combinedData = stats.dailyOrders.map((o) => {
    const rev = stats.dailyRevenue.find((r) => r.date === o.date);
    return {
      date: o.date,
      label: moment(o.date).format("MMM D"),
      orders: o.count,
      revenue: rev ? rev.total : 0,
    };
  });

  return (
    <div className="mt-2 space-y-6">
      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatCard label="Total Orders" value={stats.totalOrders} color="orange" />
        <StatCard
          label="Total Revenue"
          value={`${currency}${Number(stats.totalRevenue).toLocaleString()}`}
          color="blue"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setRange(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              range === f.value
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <SalesChart
        combinedData={combinedData}
        stats={stats}
        mode={mode}
        setMode={setMode}
        loading={loading}
        currency={currency}
      />
    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className={`text-3xl font-bold text-${color}-500 mt-2`}>{value}</p>
  </div>
);

const SalesChart = ({ combinedData, stats, mode, setMode, loading, currency }) => (
  <div className="bg-white shadow rounded-2xl p-4 sm:p-6 border border-gray-100 mt-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Orders & Revenue Trend
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Track total orders and total revenue over the selected period.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
          Orders: {stats.totalOrders}
        </span>
        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          Revenue: {`${ currency }${Number(stats.totalRevenue).toLocaleString()}`}
        </span>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <ChartToggle label="Orders" active={mode === "orders"} onClick={() => setMode("orders")} />
      <ChartToggle label="Revenue" active={mode === "revenue"} onClick={() => setMode("revenue")} />
      <ChartToggle
        label="Comparison"
        active={mode === "comparison"}
        onClick={() => setMode("comparison")}
      />
    </div>

    {loading ? (
      <p className="text-center text-gray-500 mt-10">Loading chart...</p>
    ) : combinedData.length === 0 ? (
      <p className="text-center text-gray-500 mt-10">No data available</p>
    ) : (
      <div className="w-full h-64 sm:h-72 md:h-80">
        <ResponsiveContainer>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
            <Tooltip />
            <Legend />
            {(mode === "orders" || mode === "comparison") && (
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            )}
            {(mode === "revenue" || mode === "comparison") && (
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

const ChartToggle = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm ${
      active ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {label}
  </button>
);
