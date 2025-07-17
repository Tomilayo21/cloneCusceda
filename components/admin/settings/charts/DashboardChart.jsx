// import { useState } from "react";
// import { BarChart, Bar, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

// const DashboardChart = ({ dailyTrend, monthlyTrend }) => {
//   const [view, setView] = useState("weekly"); // "weekly" or "monthly"
//   const chartData = view === "weekly" ? dailyTrend : monthlyTrend;

//   return (
//     <div className="p-4 bg-white rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Sales Trend</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setView("weekly")}
//             className={`px-3 py-1 rounded ${view === "weekly" ? "bg-black text-white" : "bg-gray-200"}`}
//           >
//             This Week
//           </button>
//           <button
//             onClick={() => setView("monthly")}
//             className={`px-3 py-1 rounded ${view === "monthly" ? "bg-black text-white" : "bg-gray-200"}`}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData}>
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
//           <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default DashboardChart;






































// "use client";

// import { useState } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import { motion, AnimatePresence } from "framer-motion";

// export default function DashboardChart({ dailyTrend, monthlyTrend }) {
//   const [view, setView] = useState("daily");
//   const data = view === "daily" ? dailyTrend : monthlyTrend;

//   return (
//     <div className="w-full">
//       {/* Toggle View */}
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Deposits Overview
//         </h3>
//         <div className="flex space-x-2">
//           <button
//             className={`px-3 py-1 rounded ${
//               view === "daily"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-3 py-1 rounded ${
//               view === "monthly"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <ResponsiveContainer width="100%" height={300}>
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={view}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.5 }}
//           >
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey={view === "daily" ? "day" : "month"}
//                 tick={{ fontSize: 12 }}
//                 stroke="#ccc"
//               />
//               <YAxis
//                 tickFormatter={(value) => `₦${value.toLocaleString()}`}
//                 tick={{ fontSize: 12 }}
//                 stroke="#ccc"
//               />
//               <Tooltip
//                 formatter={(value) => `₦${value.toLocaleString()}`}
//                 labelFormatter={(label) =>
//                   view === "daily" ? `Day: ${label}` : `Month: ${label}`
//                 }
//                 contentStyle={{
//                   backgroundColor: "#fff",
//                   borderColor: "#e5e7eb",
//                   color: "#111827",
//                 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="amount"
//                 stroke="#3B82F6"
//                 fillOpacity={1}
//                 fill="url(#colorAmount)"
//               />
//             </AreaChart>
//           </motion.div>
//         </AnimatePresence>
//       </ResponsiveContainer>
//     </div>
//   );
// }











































































// "use client";

// import { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function DashboardChart({ dailyTrend, monthlyTrend }) {
//   const [view, setView] = useState("daily"); // Toggle state

//   const data = view === "daily" ? dailyTrend : monthlyTrend;

//   return (
//     <div className="w-full">
//       {/* Toggle Buttons */}
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">Deposits Overview</h3>
//         <div className="flex space-x-2">
//           <button
//             className={`px-3 py-1 rounded ${
//               view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-3 py-1 rounded ${
//               view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey={view === "daily" ? "day" : "month"}
//             tick={{ fontSize: 12 }}
//           />
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
//           <Bar dataKey="amount" fill="#3B82F6" radius={[5, 5, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }













// "use client";

// import { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function DashboardChart({ dailyTrend = [], monthlyTrend = [] }) {
//   const [view, setView] = useState("daily");

//   const data = view === "daily" ? dailyTrend : monthlyTrend;

//   return (
//     <div className="w-full bg-white p-4 rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">Deposit Trend</h2>
//         <div className="flex space-x-2">
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis
//             tickFormatter={(value) => `₦${value.toLocaleString()}`}
//             tick={{ fontSize: 12 }}
//             />
//             <Tooltip
//             formatter={(value) => `₦${value.toLocaleString()}`}
//             labelFormatter={(label) =>
//                 view === "daily" ? `Day: ${label}` : `Month: ${label}`
//             }
//             />
//             <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//         </BarChart>
//     </ResponsiveContainer>

//     </div>
//   );
// }







































// "use client";

// import { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function DashboardChart({ dailyTrend = [], monthlyStats = [] }) {
//   const [view, setView] = useState("daily");

//   // Properly transform `monthlyStats` to `monthlyTrend`
//   const monthlyTrend = monthlyStats.map((entry) => ({
//     date: `${entry._id.month}/${entry._id.year}`, // Format: "7/2025"
//     total: entry.total,
//   }));

//   // Select data based on current view
//   const data = view === "daily" ? dailyTrend : monthlyTrend;

//   return (
//     <div className="w-full bg-white p-4 rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">
//           Deposit Trend – {view === "daily" ? "This Week" : "This Month"}
//         </h2>
//         <div className="flex space-x-2">
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
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
//           <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }







































// .............................................................................................
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

// export default function DashboardChart({ dailyTrend = [], monthlyStats = [] }) {
//   const [view, setView] = useState("daily");

//   // Helper: Convert weekday index to label
//   const getDayLabel = (dateStr) => {
//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     return days[new Date(dateStr).getDay()];
//   };

//   // Helper: Convert month index to label
//   const getMonthLabel = (monthIndex) => {
//     const months = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//     ];
//     return months[monthIndex - 1]; // because MongoDB month starts at 1
//   };

//   // Transform weekly data (limit to 7 days, latest first)
//   const weeklyTrend = dailyTrend
//     .slice()
//     .sort((a, b) => new Date(a._id) - new Date(b._id))
//     .slice(-7)
//     .map((entry) => ({
//       date: getDayLabel(entry._id), // _id is expected to be a date string
//       total: entry.total,
//     }));

//   // Transform monthly data
//   const monthlyTrend = monthlyStats.map((entry) => ({
//     date: getMonthLabel(entry._id.month),
//     total: entry.total,
//   }));

//   const data = view === "daily" ? weeklyTrend : monthlyTrend;

//   return (
//     <div className="w-full bg-white p-4 rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">
//           Deposit Trend – {view === "daily" ? "This Week" : "This Month"}
//         </h2>
//         <div className="flex space-x-2">
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-1 rounded ${
//               view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
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
//             stroke="#3B82F6"
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
// ..................................................................



































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
import moment from "moment"; // Ensure moment is installed

export default function DashboardChart({ dailyTrend = [], monthlyTrend = []  }) {
  const [view, setView] = useState("daily");

  // Convert dailyTrend to show day names
  const formattedDaily = dailyTrend.map((entry) => ({
    date: moment(entry._id).format("ddd"), // e.g., "Mon", "Tue"
    total: entry.total,
  }));

  // Convert monthlyStats to show month names
  const formattedMonthly = monthlyTrend.map((entry) => {
    if (entry._id && typeof entry._id.year === "number" && typeof entry._id.month === "number") {
        return {
        date: moment(`${entry._id.year}-${entry._id.month}-01`).format("MMM"),
        total: entry.total,
        };
    } else {
        return {
        date: "N/A",
        total: entry.total || 0,
        };
    }
    });



  const data = view === "daily" ? formattedDaily : formattedMonthly;

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          Deposit Trend – {view === "daily" ? "This Week" : "This Month"}
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-1 rounded ${
              view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("daily")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-1 rounded ${
              view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("monthly")}
          >
            This Month
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `₦${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => `₦${value.toLocaleString()}`}
            labelFormatter={(label) =>
              view === "daily" ? `Day: ${label}` : `Month: ${label}`
            }
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
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
