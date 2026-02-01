
import { AccountsClient } from "./AccountsClient";


interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
}

interface DailyBar {
  date: string;
  total: number;
}

interface AccountWithStats {
  id: number;
  name: string;
  type: string;
  bank: string;
  balance: number;
  color: string;
  monthlyExpenses: number;
  monthlyCount: number;
  dailyBars: DailyBar[];
  transactions: Transaction[];
}


const MOCK_ACCOUNTS: AccountWithStats[] = [
  {
    id: 1,
    name: "Main Checking",
    bank: "CHASE BANK",
    type: "checking",
    balance: 1200.00,
    color: "#6366f1", 
    monthlyExpenses: -713.40,
    monthlyCount: 4,
    dailyBars: [
      { date: "2026-04-01", total: 120.00 },
      { date: "2026-04-02", total: 0 },
      { date: "2026-04-03", total: 80.50 },
      { date: "2026-04-04", total: 512.90 },
    ],
    transactions: [
      { id: 1, date: "Apr 04", description: "Walmart", amount: -512.90 },
      { id: 2, date: "Apr 01", description: "Starbucks", amount: -120.00 },
    ],
  },
  {
    id: 2,
    name: "Visa Credit",
    bank: "AMEX",
    type: "credit_card",
    balance: -450.00,
    color: "#8b5cf6",
    monthlyExpenses: -199.10,
    monthlyCount: 5,
    dailyBars: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-04-0${i+1}`,
      total: Math.random() * 100
    })),
    transactions: [
      { id: 3, date: "Apr 05", description: "Uber *Trip", amount: -5.40 },
    ],
  },
];

// ─── COMPONENT ─────────────────────────────────────

export default function AccountsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Accounts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your banking products and review daily activity.
          </p>
        </header>
        
        <AccountsClient accounts={MOCK_ACCOUNTS} />
      </div>
    </div>
  );
}