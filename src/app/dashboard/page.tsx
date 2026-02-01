// import SummaryCards from "@/components/dashboard/SummaryCards";
// import ExpenseChart from "@/components/dashboard/ExpenseChart";
// import IncomeChart from "@/components/dashboard/IncomeChart";
// import Insights from "@/components/dashboard/Insights";

// // async function getData() {
// //   const res = await fetch("http://localhost:3000/api/dashboard", {
// //     cache: "no-store",
// //   });
// //   return res.json();
// // }

// async function getData() {
//   const res = await fetch("http://localhost:3000/api/dashboard", {
//     cache: "no-store",
//   });

//   return res.json();
// }

// export default async function DashboardPage() {
//   const data = await getData();

//   return (
//     <div style={{ padding: "20px", color: "white" }}>
//       <h1>Dashboard</h1>

//       <div style={{ marginTop: "20px" }}>
//         <h2>Income: ₹{data.income}</h2>
//         <h2>Expense: ₹{data.expense}</h2>
//         <h2>Balance: ₹{data.balance}</h2>
//       </div>
//     </div>
//   );
// }



// export default async function DashboardPage() {
//   const data = await getData();

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Dashboard</h1>

//       <SummaryCards
//         income={data.income}
//         expense={data.expense}
//         balance={data.balance}
//       />

//       <ExpenseChart data={data.expenseByCategory || []} />

//       <IncomeChart data={data.monthlyData || []} />

//       <Insights insights={data.insights || []} />
//     </div>
//   );
// }

















import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import IncomeChart from "@/components/dashboard/IncomeChart";
import Insights from "@/components/dashboard/Insights";

async function getData() {
  const res = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  return res.json();
}

export default async function DashboardPage() {
  const data = await getData();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Summary Cards */}
      <SummaryCards
        income={data.income}
        expense={data.expense}
        balance={data.balance}
      />

      {/* Expense Chart */}
      <ExpenseChart data={data.expenseByCategory || {}} />

      {/* Income Chart (optional for now) */}
      <IncomeChart data={data.monthlyData || []} />

      {/* Insights */}
      <Insights insights={data.insights || []} />
    </div>
  );
}