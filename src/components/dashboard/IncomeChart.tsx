"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IncomeChart({ data }: any) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Monthly Income vs Expense</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#52c41a" />
          <Bar dataKey="expense" fill="#ff4d4f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}