"use client";

import { useState } from "react";

export interface DailySpend {
  date: string;
  amount: number;
}

interface Tooltip {
  clientX: number;
  clientY: number;
  date: string;
  amount: number;
}

const CELL = 13;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT_LABEL_W = 28;
const TOP_LABEL_H = 20;

// ✅ ENGLISH MONTHS
const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const DAY_LABELS = [
  { index: 1, label: "Mon" },
  { index: 3, label: "Wed" },
  { index: 5, label: "Fri" },
  { index: 0, label: "Sun" },
];

function colorForAmount(amount: number, max: number): string {
  if (amount === 0) return "#1e293b"; // slate-800

  const t = Math.min(amount / max, 1);

  const r = Math.round(30 + t * 0);
  const g = Math.round(41 + t * 120);
  const b = Math.round(59 + t * 200);

  return `rgb(${r},${g},${b})`;
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
}

function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toLocaleString("en-US")}`;
}

export function SpendingHeatmap({
  data,
  year,
  today,
}: {
  data: DailySpend[];
  year: number;
  today: string;
}) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const spendMap = new Map<string, number>();
  for (const d of data) spendMap.set(d.date, d.amount);

  const maxSpend = Math.max(...data.map((d) => d.amount), 1);

  const todayMonth = parseInt(today.split("-")[1], 10);

  const janFirst = new Date(Date.UTC(year, 0, 1));
  const startDow = janFirst.getUTCDay();
  const startOffset = (startDow + 6) % 7;

  const endDate = new Date(Date.UTC(year, todayMonth, 0));
  const msPerDay = 86400000;
  const dayCount =
    Math.floor((endDate.getTime() - janFirst.getTime()) / msPerDay) + 1;

  const totalCells = startOffset + dayCount;
  const numWeeks = Math.ceil(totalCells / 7);

  const monthCols: { month: number; col: number }[] = [];

  for (let m = 1; m <= todayMonth; m++) {
    const d = new Date(Date.UTC(year, m - 1, 1));
    const dayIdx = Math.floor((d.getTime() - janFirst.getTime()) / msPerDay);
    const col = Math.floor((startOffset + dayIdx) / 7);
    monthCols.push({ month: m, col });
  }

  const svgWidth = LEFT_LABEL_W + numWeeks * STEP;
  const svgHeight = TOP_LABEL_H + 7 * STEP;

  const SWATCHES = 5;
  const legendColors = Array.from({ length: SWATCHES }, (_, i) => {
    const t = i / (SWATCHES - 1);
    return colorForAmount(t * maxSpend, maxSpend);
  });

  return (
    <div className="flex flex-col gap-3">

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} style={{ minWidth: svgWidth }}>

          {/* DAY LABELS */}
          {DAY_LABELS.map(({ index, label }) => (
            <text
              key={label}
              x={LEFT_LABEL_W - 6}
              y={TOP_LABEL_H + index * STEP + CELL / 2 + 4}
              textAnchor="end"
              fontSize={9}
              fill="#64748b"
            >
              {label}
            </text>
          ))}

          {/* MONTH LABELS */}
          {monthCols.map(({ month, col }, i) => {
            const nextCol = monthCols[i + 1]?.col ?? numWeeks;
            if (nextCol - col < 2) return null;

            return (
              <text
                key={month}
                x={LEFT_LABEL_W + col * STEP}
                y={TOP_LABEL_H - 6}
                fontSize={9}
                fill="#64748b"
              >
                {MONTH_NAMES[month - 1]}
              </text>
            );
          })}

          {/* CELLS */}
          {Array.from({ length: numWeeks }, (_, week) =>
            Array.from({ length: 7 }, (_, dow) => {
              const cellIndex = week * 7 + dow;
              const dayIndex = cellIndex - startOffset;

              if (dayIndex < 0 || dayIndex >= dayCount) return null;

              const date = new Date(Date.UTC(year, 0, 1 + dayIndex));
              const dateStr = date.toISOString().slice(0, 10);

              const spend = spendMap.get(dateStr) ?? 0;
              const isToday = dateStr === today;

              const cx = LEFT_LABEL_W + week * STEP;
              const cy = TOP_LABEL_H + dow * STEP;

              return (
                <rect
                  key={dateStr}
                  x={cx}
                  y={cy}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={colorForAmount(spend, maxSpend)}
                  stroke={isToday ? "#22d3ee" : "none"}
                  strokeWidth={isToday ? 2 : 0}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      clientX: e.clientX,
                      clientY: e.clientY,
                      date: dateStr,
                      amount: spend,
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) =>
                      prev
                        ? { ...prev, clientX: e.clientX, clientY: e.clientY }
                        : prev
                    )
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* TOOLTIP */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white shadow-xl"
          style={{
            left: tooltip.clientX + 14,
            top: tooltip.clientY - 48,
            fontSize: 12,
          }}
        >
          <div className="font-medium">
            {formatDateLabel(tooltip.date)}
          </div>

          <div className="text-slate-400">
            {tooltip.amount === 0
              ? "No spending"
              : formatCurrency(tooltip.amount)}
          </div>
        </div>
      )}

      {/* LEGEND */}
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-[10px] text-slate-400">Less</span>

        {legendColors.map((color, i) => (
          <div
            key={i}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: 3,
              background: color,
            }}
          />
        ))}

        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  );
}







