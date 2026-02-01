"use client";

type Props = {
  income: number;
  expense: number;
  balance: number;
};

export default function SummaryCards({ income, expense, balance }: Props) {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <Card title="Income" value={income} color="green" />
      <Card title="Expense" value={expense} color="red" />
      <Card title="Balance" value={balance} color="blue" />
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        borderRadius: "10px",
        background: "#111",
        color: "white",
        border: `1px solid ${color}`,
      }}
    >
      <h3>{title}</h3>
      <h2>₹ {value}</h2>
    </div>
  );
}