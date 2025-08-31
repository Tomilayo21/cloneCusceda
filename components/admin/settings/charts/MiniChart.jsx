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