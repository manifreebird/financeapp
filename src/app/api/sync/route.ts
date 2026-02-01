

// import { NextRequest, NextResponse } from "next/server";
// import { spawn } from "child_process";
// import path from "path";

// // ─── CATEGORY RULES ────────────────────────────────

// const CATEGORY_RULES: [RegExp, string][] = [
//   [/supermarket|lider|jumbo|tottus/i, "Groceries"],
//   [/uber|taxi|fuel|metro|transport/i, "Transport"],
//   [/netflix|spotify|steam|playstation|xbox/i, "Entertainment"],
//   [/pharmacy|hospital|clinic|doctor|gym/i, "Health"],
//   [/restaurant|pizza|burger|mcdon/i, "Food"],
//   [/internet|electricity|gas|phone/i, "Bills"],
//   [/amazon|mercado libre|shopping/i, "Shopping"],
//   [/course|education|udemy/i, "Education"],
//   [/salary|income/i, "Income"],
//   [/transfer/i, "Transfer"],
// ];

// function guessCategory(description: string): string {
//   for (const [pattern, category] of CATEGORY_RULES) {
//     if (pattern.test(description)) return category;
//   }
//   return "Other";
// }

// // ─── RUN SCRAPER ───────────────────────────────────

// function runScraper(bankId: string, rut: string, password: string) {
//   return new Promise<any>((resolve, reject) => {
//     const scriptPath = path.join(process.cwd(), "scripts", "sync-bank.mjs");

//     const child = spawn("node", [scriptPath, bankId], {
//       timeout: 180000,
//     });

//     let stdout = "";
//     let stderr = "";

//     child.stdout.on("data", (d) => (stdout += d.toString()));
//     child.stderr.on("data", (d) => (stderr += d.toString()));

//     child.stdin.write(JSON.stringify({ rut, password }));
//     child.stdin.end();

//     child.on("close", () => {
//       try {
//         const lines = stdout.trim().split("\n");
//         const lastLine = lines[lines.length - 1];
//         resolve(JSON.parse(lastLine));
//       } catch {
//         reject(new Error("Failed to parse scraper output"));
//       }
//     });

//     child.on("error", reject);
//   });
// }

// // ─── API ROUTE ─────────────────────────────────────

// export async function POST(req: NextRequest) {
//   try {
//     const { bankId, rut, password } = await req.json();

//     if (!bankId || !rut || !password) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const result = await runScraper(bankId, rut, password);

//     if (!result.success) {
//       return NextResponse.json(
//         { error: result.error || "Bank connection failed" },
//         { status: 500 }
//       );
//     }

//     // Instead of saving to Prisma, we process the movements and return them
//     const processedAccounts = (result.accounts ?? []).map((acc: any) => {
//       const movements = (acc.movements ?? []).map((m: any) => ({
//         ...m,
//         category: guessCategory(m.description),
//       }));

//       return {
//         name: acc.label || "Main Account",
//         bank: result.bank ?? bankId,
//         balance: acc.balance ?? 0,
//         movements,
//       };
//     });

//     return NextResponse.json({
//       success: true,
//       bank: result.bank ?? bankId,
//       accounts: processedAccounts,
//     });

//   } catch (err: any) {
//     console.error("Sync error:", err);
//     return NextResponse.json(
//       { error: err?.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import { prisma } from "@/lib/db"; // Import the fixed DB

// --- CATEGORY RULES (Keep these, they work great) ---
const CATEGORY_RULES: [RegExp, string][] = [
  [/supermarket|lider|jumbo|tottus|blinkit|zepto|swiggy/i, "Groceries"], // Added Indian context
  [/uber|taxi|fuel|metro|transport|ola/i, "Transport"],
  [/netflix|spotify|steam|playstation|xbox/i, "Entertainment"],
  [/pharmacy|hospital|clinic|doctor|gym/i, "Health"],
  [/restaurant|pizza|burger|mcdon|zomato/i, "Food"],
  [/internet|electricity|gas|phone/i, "Bills"],
  [/amazon|mercado libre|shopping|flipkart/i, "Shopping"],
  [/course|education|udemy/i, "Education"],
  [/salary|income/i, "Income"],
  [/transfer/i, "Transfer"],
];

function guessCategory(description: string): string {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(description)) return category;
  }
  return "Other";
}

// --- RUN SCRAPER (Chile Version) ---
function runScraper(bankId: string, rut: string, password: string) {
  return new Promise<any>((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "sync-bank.mjs");
    const child = spawn("node", [scriptPath, bankId], { timeout: 180000 });

    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stdin.write(JSON.stringify({ rut, password }));
    child.stdin.end();

    child.on("close", () => {
      try {
        const lines = stdout.trim().split("\n");
        resolve(JSON.parse(lines[lines.length - 1]));
      } catch { reject(new Error("Failed to parse scraper output")); }
    });
    child.on("error", reject);
  });
}

// --- MAIN API ROUTE ---
export async function POST(req: NextRequest) {
  try {
    const { bankId, rut, password } = await req.json();

    if (!bankId || !rut || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Get the data from the scraper
    const result = await runScraper(bankId, rut, password);

    if (!result.success) {
      return NextResponse.json({ error: "Bank connection failed" }, { status: 500 });
    }

    // 2. Process and SAVE to Database
    const savedData = await Promise.all(result.accounts.map(async (acc: any) => {
      // Save the account info via Prisma
      const dbAccount = await prisma.account.upsert({
        where: { id: acc.id || `${bankId}-${rut}` },
        update: { balance: acc.balance },
        create: { 
          id: acc.id || `${bankId}-${rut}`,
          name: acc.label || "Main Account",
          balance: acc.balance,
          bank: result.bank || bankId 
        },
      });

      // Process and Save movements
      const movements = acc.movements.map((m: any) => ({
        ...m,
        accountId: dbAccount.id,
        category: guessCategory(m.description),
      }));

      // In a real app, use createMany to save these to a 'Movements' table
      // await prisma.movement.createMany({ data: movements, skipDuplicates: true });

      return { ...dbAccount, movements };
    }));

    return NextResponse.json({ success: true, accounts: savedData });

  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}