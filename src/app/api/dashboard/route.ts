// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   const transactions = await prisma.transaction.findMany();

//   const income = transactions
//     .filter(t => t.type === "INCOME")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const expense = transactions
//     .filter(t => t.type === "EXPENSE")
//     .reduce((sum, t) => sum + t.amount, 0);

//   return Response.json({
//     income,
//     expense,
//     balance: income - expense,
//   });
// }




import { prisma } from "@/lib/db";

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    include: { category: true },
  });

  let income = 0;
  let expense = 0;

  const expenseByCategory: Record<string, number> = {};
  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }

    if (t.type === "INCOME") {
      income += t.amount;
      monthlyMap[month].income += t.amount;
    } else {
      expense += t.amount;
      monthlyMap[month].expense += t.amount;

      const key = t.category.name;
      expenseByCategory[key] =
        (expenseByCategory[key] || 0) + t.amount;
    }
  });

  const monthlyData = Object.entries(monthlyMap).map(
    ([month, values]) => ({
      month,
      ...values,
    })
  );

  return Response.json({
    income,
    expense,
    balance: income - expense,
    expenseByCategory,
    monthlyData,
  });
}