"use client";

export default function Insights({ insights }: { insights: string[] }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "#1a1a1a",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <h3>Insights</h3>
      <ul>
        {insights.map((text, i) => (
          <li key={i}>👉 {text}</li>
        ))}
      </ul>
    </div>
  );
}