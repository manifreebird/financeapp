

import { PrismaClient } from "@prisma/client";
import { TransactionsClient } from "./TransactionsClient";

const prisma = new PrismaClient();

export default async function TransactionsPage() {
  // ✅ Fetch from DB
  const transactions = await prisma.transaction.findMany({
    include: {
      account: true,
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const accounts = await prisma.account.findMany();
  const categories = await prisma.category.findMany();

  // ✅ Convert to frontend-friendly format
  const formattedTransactions = transactions.map((t) => ({
    id: t.id,
    date: t.date.toISOString(),
    description: t.description || "",
    amount: t.type === "EXPENSE" ? -t.amount : t.amount,
    account: {
      id: t.account.id,
      name: t.account.name,
    },
    category: {
      id: t.category.id,
      name: t.category.name,
      emoji: "💸", // you can improve later
    },
  }));

  const formattedAccounts = accounts.map((a) => ({
    id: a.id,
    name: a.name,
  }));

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: "📁",
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Transactions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Full history of your movements and expenses.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto w-full">
        <TransactionsClient
          transactions={formattedTransactions}
          accounts={formattedAccounts}
          categories={formattedCategories}
        />
      </div>
    </div>
  );
}


