// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // 1️⃣ Create categories
//   const categories = await prisma.category.createMany({
//     data: [
//       { name: "Food", type: "EXPENSE" },
//       { name: "Shopping", type: "EXPENSE" },
//       { name: "Salary", type: "INCOME" },
//     ],
//     skipDuplicates: true,
//   });

//   // 2️⃣ Fetch categories (to get IDs)
//   const allCategories = await prisma.category.findMany();

//   const food = allCategories.find(c => c.name === "Food")!;
//   const shopping = allCategories.find(c => c.name === "Shopping")!;
//   const salary = allCategories.find(c => c.name === "Salary")!;

//   // 3️⃣ Create account
//   const account = await prisma.account.create({
//     data: {
//       name: "Main Account",
//       bank: "HDFC",
//       balance: 10000,
//     },
//   });

//   // 4️⃣ Create transactions
//   await prisma.transaction.createMany({
//     data: [
//       {
//         amount: 500,
//         description: "Lunch",
//         type: "EXPENSE",
//         categoryId: food.id,        // ✅ FIXED
//         accountId: account.id,
//       },
//       {
//         amount: 2000,
//         description: "Shopping Mall",
//         type: "EXPENSE",
//         categoryId: shopping.id,    // ✅ FIXED
//         accountId: account.id,
//       },
//       {
//         amount: 30000,
//         description: "Salary",
//         type: "INCOME",
//         categoryId: salary.id,      // ✅ FIXED
//         accountId: account.id,
//       },
//     ],
//   });

//   console.log("✅ Seed data inserted successfully");
// }

// main()
//   .then(() => prisma.$disconnect())
//   .catch((e) => {
//     console.error(e);
//     prisma.$disconnect();
//     process.exit(1);
//   });



import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Account
  const account = await prisma.account.create({
    data: {
      name: "Main Account",
      bank: "Cash",
      balance: 0,
    },
  });

  // Create Categories
await prisma.category.createMany({
  data: [
    { name: "Salary", type: "INCOME" },
    { name: "Food", type: "EXPENSE" },
  ],
  skipDuplicates: true, // ✅ THIS FIXES YOUR ERROR
});

  console.log("Seed data created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());