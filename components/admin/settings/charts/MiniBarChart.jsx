// // components/ui/MiniBarChart.jsx
// "use client";
// import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";

// export default function MiniBarChart({ data, color = "#2563eb" }) {
//   return (
//     <ResponsiveContainer width={100} height={40}>
//       <BarChart data={data}>
//         <Tooltip
//           contentStyle={{
//             backgroundColor: "#fff",
//             border: "1px solid #ddd",
//             fontSize: "0.75rem",
//           }}
//           formatter={(value) => [`₦${value.toLocaleString()}`, "Amount"]}
//         />
//         <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }





"use client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";

export default function MiniChart({ range = "week" }) {
  const [chartData, setChartData] = useState([]);
  const [currentRange, setCurrentRange] = useState(range);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/dashboard/stats/chart?range=${currentRange}`);
      const data = await res.json();
      setChartData(data);
    };

    fetchData();
  }, [currentRange]);

  return (
    <div className="w-full">
      {/* Toggle buttons */}
      <div className="flex gap-2 mb-2">
        {["week", "month"].map((r) => (
          <button
            key={r}
            onClick={() => setCurrentRange(r)}
            className={`text-xs px-2 py-1 rounded ${
              currentRange === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {r === "week" ? "This Week" : "This Month"}
          </button>
        ))}
      </div>

      {/* Line chart */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                fontSize: "0.75rem",
              }}
              formatter={(value) => [`₦${value.toLocaleString()}`, "Total"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
