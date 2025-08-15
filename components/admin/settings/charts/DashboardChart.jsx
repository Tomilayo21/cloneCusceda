// "use client";

// import { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import moment from "moment"; // Ensure moment is installed

// export default function DashboardChart({ dailyTrend = [], monthlyTrend = []  }) {
//   const [view, setView] = useState("daily");

//   // Convert dailyTrend to show day names
//   const formattedDaily = dailyTrend.map((entry) => ({
//     date: moment(entry._id).format("ddd"), // e.g., "Mon", "Tue"
//     total: entry.total,
//   }));

//   // Convert monthlyStats to show month names
//   const formattedMonthly = monthlyTrend.map((entry) => {
//     if (entry._id && typeof entry._id.year === "number" && typeof entry._id.month === "number") {
//         return {
//         date: moment(`${entry._id.year}-${entry._id.month}-01`).format("MMM"),
//         total: entry.total,
//         };
//     } else {
//         return {
//         date: "N/A",
//         total: entry.total || 0,
//         };
//     }
//     });



//   const data = view === "daily" ? formattedDaily : formattedMonthly;

//   return (
//     <div className="w-full bg-white p-4 rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">
//           Deposit Trend – {view === "daily" ? "This Week" : "This Month"}
//         </h2>
//         <div className="flex space-x-2">
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "daily" ? "bg-orange-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "monthly" ? "bg-orange-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//           <YAxis
//             tickFormatter={(value) => `₦${value.toLocaleString()}`}
//             tick={{ fontSize: 12 }}
//           />
//           <Tooltip
//             formatter={(value) => `₦${value.toLocaleString()}`}
//             labelFormatter={(label) =>
//               view === "daily" ? `Day: ${label}` : `Month: ${label}`
//             }
//           />
//           <Line
//             type="monotone"
//             dataKey="total"
//             stroke="#EA580C"
//             strokeWidth={3}
//             dot={{ r: 5 }}
//             activeDot={{ r: 8 }}
//             animationDuration={500}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


















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
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          Deposit Trend – {view === "daily" ? "This Week" : "This Month"}
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-1 rounded ${
              view === "daily" ? "bg-orange-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("daily")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-1 rounded ${
              view === "monthly" ? "bg-orange-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("monthly")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) =>
              `₦${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}`
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
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
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
