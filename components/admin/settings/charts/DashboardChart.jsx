"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import moment from "moment";

export default function DashboardChart({ dailyTrend = [], monthlyTrend = [] }) {
  const [view, setView] = useState("daily");

  // Format daily data with day names
  const formattedDaily = Array.isArray(dailyTrend)
    ? dailyTrend.map((entry) => ({
        date: entry?._id ? moment(entry._id).format("ddd") : "N/A",
        total: typeof entry?.total === "number" ? entry.total : 0,
      }))
    : [];

  // Format monthly data with month names
  const formattedMonthly = Array.isArray(monthlyTrend)
    ? monthlyTrend.map((entry) => {
        if (
          entry?._id &&
          typeof entry._id.year === "number" &&
          typeof entry._id.month === "number"
        ) {
          return {
            date: moment(`${entry._id.year}-${entry._id.month}-01`).format("MMM"),
            total: typeof entry.total === "number" ? entry.total : 0,
          };
        } else {
          return {
            date: "N/A",
            total: typeof entry?.total === "number" ? entry.total : 0,
          };
        }
      })
    : [];

  const data = view === "daily" ? formattedDaily : formattedMonthly;

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Deposit Trend —{" "}
          <span className="text-orange-600">
            {view === "daily" ? "This Week" : "This Month"}
          </span>
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              view === "daily"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setView("daily")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              view === "monthly"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setView("monthly")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) =>
                `₦${Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}`
              }
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value) =>
                `₦${Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}`
              }
              labelFormatter={(label) =>
                view === "daily" ? `Day: ${label}` : `Month: ${label}`
              }
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#EA580C"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#EA580C" }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: "#EA580C", fill: "#fff" }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
