

import { SpendingHeatmap, DailySpend } from "../components/SpendingHeatmap";


const MONTH_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];


interface Account {
  id: number;
  name: string;
  balance: number;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: { emoji: string; name: string };
  account: { name: string };
}

interface DashboardProps {
  year?: number;
  month?: number;
  currentExpenses?: number;
  comparisonText?: string;
  totalBalance?: number;
  accounts?: Account[];
  spentByAccount?: Record<number, number>;
  recentTx?: Transaction[];
  heatmapData?: DailySpend[];
  todayStr?: string;
}


const MOCK_ACCOUNTS: Account[] = [
  { id: 1, name: "Checking Account", balance: 1200.00 },
  { id: 2, name: "Credit Card", balance: -450.00 },
  { id: 3, name: "Savings Account", balance: 180.00 },
];

const MOCK_SPENT_BY_ACCOUNT = {
  1: 71.34,
  2: 205.40,
  3: 38.45,
};

const MOCK_RECENT_TX: Transaction[] = [
  {
    id: 1,
    description: "Uber *Trip",
    amount: -5.40,
    category: { emoji: "🚗", name: "Transport" },
    account: { name: "Credit Card" },
  },
  {
    id: 2,
    description: "Starbucks Coffee",
    amount: -4.20,
    category: { emoji: "☕", name: "Food" },
    account: { name: "Checking Account" },
  },
  {
    id: 3,
    description: "Monthly Salary",
    amount: 1200.00,
    category: { emoji: "💰", name: "Income" },
    account: { name: "Checking Account" },
  },
];

// ─── PAGE ───────────────────────────────────────────

export default function DashboardPage({
  year = 2026,
  month = 3, // April (0-indexed)
  currentExpenses = 315.19,
  comparisonText = "71% less than March",
  totalBalance = 930.00,
  accounts = MOCK_ACCOUNTS,
  spentByAccount = MOCK_SPENT_BY_ACCOUNT,
  recentTx = MOCK_RECENT_TX,
  heatmapData = [], 
  todayStr = "2026-04-05",
}: DashboardProps) {
  
  const currentMonthName = MONTH_EN[month] || "Current Month";
  
  // Color coding logic based on English keywords
  const isBetter = comparisonText ? (comparisonText.toLowerCase().includes("less") || comparisonText.toLowerCase().includes("more income")) : false;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full px-4">
        <div className="flex items-center gap-3">
    
        </div>
     
      </header>

      {/* HERO SECTION */}
      <section className="text-center">
        <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-semibold">
          SPENT IN {currentMonthName.toUpperCase()}
        </p>

        <p className="text-6xl font-black my-2 tracking-tight">
          ${currentExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>

        {comparisonText && (
          <p 
            className="text-sm font-bold" 
            style={{ color: isBetter ? "#22c55e" : "#ef4444" }}
          >
            {comparisonText}
          </p>
        )}

        <p className="text-xs text-slate-500 mt-4">
          Total Balance: <span className="text-slate-300 font-semibold">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span> across {accounts.length} accounts
        </p>
      </section>

      {/* ACCOUNTS GRID */}
      <section className="flex flex-wrap gap-4 justify-center">
        {accounts.map((acc) => {
          const spent = spentByAccount[acc.id as keyof typeof spentByAccount] ?? 0;

          return (
            <div
              key={acc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 min-w-[220px] shadow-xl"
            >
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{acc.name}</p>
              <p className="text-white font-bold text-2xl mt-1">
                {acc.balance < 0 ? "-" : ""}${Math.abs(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                ${spent.toLocaleString("en-US", { minimumFractionDigits: 2 })} spent this month
              </p>
            </div>
          );
        })}
      </section>

      {/* HEATMAP SECTION */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-5xl mx-auto w-full">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase mb-6 tracking-[0.15em]">
          SPENDING ACTIVITY {year}
        </h2>
        <SpendingHeatmap data={heatmapData} year={year} today={todayStr} />
      </section>

      {/* RECENT TRANSACTIONS */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto w-full">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-wider">
          Recent Transactions
        </h2>

        <div className="flex flex-col gap-4">
          {recentTx.map((tx) => {
            const isExpense = tx.amount < 0;
            return (
              <div key={tx.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-xl">
                    {tx.category?.emoji || "💸"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{tx.description}</span>
                    <span className="text-[10px] text-slate-500">{tx.account?.name}</span>
                  </div>
                </div>
                <span 
                  className={`font-mono font-bold ${isExpense ? 'text-red-500' : 'text-emerald-500'}`}
                >
                  {isExpense ? "-" : "+"}${Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}