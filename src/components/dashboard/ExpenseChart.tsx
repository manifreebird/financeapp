"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ExpenseChart({ data }: { data: Record<string, number> }) {
  // 🔥 Convert object → array
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));

  if (chartData.length === 0) {
    return <p>No expense data</p>;
  }

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
      >
        {chartData.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}