import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const MiniChart = ({ data }) => (
  <div className="w-full h-20">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
        <Line type="monotone" dataKey="total" stroke="#EA580C" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MiniChart;


































// "use client";
// import {
//   LineChart,
//   Line,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { useState, useEffect } from "react";

// export default function MiniChart({ range = "week" }) {
//   const [chartData, setChartData] = useState([]);
//   const [currentRange, setCurrentRange] = useState(range);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`/api/dashboard/stats/chart?range=${currentRange}`);
//       const data = await res.json();
//       setChartData(data);
//     };

//     fetchData();
//   }, [currentRange]);

//   return (
//     <div className="w-full">
//       {/* Toggle buttons */}
//       <div className="flex gap-2 mb-2">
//         {["week", "month"].map((r) => (
//           <button
//             key={r}
//             onClick={() => setCurrentRange(r)}
//             className={`text-xs px-2 py-1 rounded ${
//               currentRange === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {r === "week" ? "This Week" : "This Month"}
//           </button>
//         ))}
//       </div>

//       {/* Line chart */}
//       <div className="h-24">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <XAxis dataKey="name" hide />
//             <YAxis hide />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 border: "1px solid #ddd",
//                 fontSize: "0.75rem",
//               }}
//               formatter={(value) => [`₦${value.toLocaleString()}`, "Total"]}
//             />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#4F46E5"
//               strokeWidth={2}
//               dot={false}
//               isAnimationActive={true}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
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
//           <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
