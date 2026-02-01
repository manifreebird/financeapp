"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";

type Account = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  emoji: string;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  account: Account;
  category: Category;
};

const CATEGORY_EMOJI: Record<string, string> = {
  Grocery: "🛒",
  Transport: "🚗",
  Entertainment: "🎬",
  Health: "💊",
  Restaurant: "🍕",
  Utilities: "📱",
  Home: "🏠",
  Education: "📚",
  Salary: "💰",
  Transfer: "🔄",
  Other: "📌",
};

function formatDate(iso: string): string {
  const d = new Date(iso);

  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CategoryBadge({ name }: { name: string }) {
  const isIncome = name === "Salary";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isIncome
          ? "bg-green-100 text-green-700"
          : "bg-indigo-100 text-indigo-700"
      }`}
    >
      {name}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}

export function TransactionsClient({
  transactions,
  accounts,
  categories,
}: Props) {
  // FORM STATE
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");

  // FILTER STATE
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ADD TRANSACTION
  const handleAddTransaction = async () => {
    if (!amount || !categoryId || !accountId) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        description,
        type,
        categoryId,
        accountId,
      }),
    });

    if (res.ok) {
      setAmount("");
      setDescription("");
      setCategoryId("");
      setAccountId("");

      window.location.reload();
    } else {
      alert("Failed to add transaction");
    }
  };

  // FILTERED DATA
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return transactions.filter((t) => {
      if (q) {
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesAccount = t.account.name.toLowerCase().includes(q);

        if (!matchesDesc && !matchesAccount) return false;
      }

      if (
        accountFilter !== "all" &&
        t.account.name !== accountFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        t.category.name !== categoryFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    transactions,
    search,
    accountFilter,
    categoryFilter,
  ]);

  // SUMMARY
  const totalCount = filtered.length;

  const totalExpenses = filtered
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = filtered
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* ADD TRANSACTION */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white mb-5">
          Add Transaction
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as "INCOME" | "EXPENSE"
              )
            }
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Category</option>

            {categories
              .filter((c) =>
                type === "INCOME"
                  ? c.name === "Salary"
                  : c.name !== "Salary"
              )
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Account</option>

            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddTransaction}
            className="bg-blue-600 hover:bg-blue-700 transition rounded-xl px-4 py-3 text-white font-semibold"
          >
            Add
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
          <p className="text-xs uppercase text-slate-400 mb-2">
            Transactions
          </p>

          <h2 className="text-4xl font-bold text-white">
            {totalCount}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
          <p className="text-xs uppercase text-slate-400 mb-2">
            Expenses
          </p>

          <h2 className="text-4xl font-bold text-red-400">
            {formatCurrency(totalExpenses)}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
          <p className="text-xs uppercase text-slate-400 mb-2">
            Income
          </p>

          <h2 className="text-4xl font-bold text-green-400">
            {formatCurrency(totalIncome)}
          </h2>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 flex-1">
          <SearchIcon />

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 outline-none text-white placeholder:text-slate-400"
          />
        </div>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white rounded-2xl px-4 py-3"
        >
          <option value="all">All Accounts</option>

          {accounts.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white rounded-2xl px-4 py-3"
        >
          <option value="all">All Categories</option>

          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden">

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-800">
                <tr className="text-left text-xs uppercase text-slate-400">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((t) => {
                  const emoji =
                    CATEGORY_EMOJI[t.category.name] ??
                    t.category.emoji ??
                    "📌";

                  return (
                    <tr
                      key={t.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="px-6 py-4 text-slate-300">
                        {formatDate(t.date)}
                      </td>

                      <td className="px-6 py-4 text-white">
                        {emoji} {t.description || "No description"}
                      </td>

                      <td className="px-6 py-4">
                        <CategoryBadge
                          name={t.category.name}
                        />
                      </td>

                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          t.amount > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
}
