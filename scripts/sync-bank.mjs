

import { getBank } from "open-banking-chile";

// Wrap everything in async main (IMPORTANT)
async function main() {
  try {
    const bankId = process.argv[2];

    if (!bankId) {
      console.log(JSON.stringify({ success: false, error: "Missing bankId argument" }));
      process.exit(1);
    }

    // ✅ Read stdin properly
    const chunks: Buffer[] = [];

    process.stdin.on("data", (chunk) => {
      chunks.push(chunk);
    });

    await new Promise<void>((resolve) => {
      process.stdin.on("end", () => resolve());
      process.stdin.resume();
    });

    let credentials;
    try {
      credentials = JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      console.log(JSON.stringify({ success: false, error: "Invalid JSON input" }));
      process.exit(1);
    }

    const { rut, password } = credentials;

    if (!rut || !password) {
      console.log(JSON.stringify({ success: false, error: "Missing credentials (rut/password)" }));
      process.exit(1);
    }

    // ✅ Get bank
    const bank = getBank(bankId);

    if (!bank) {
      console.log(JSON.stringify({ success: false, error: `Bank "${bankId}" not supported` }));
      process.exit(1);
    }

    // ✅ Scrape
    const result = await bank.scrape({ rut, password });

    const output = {
      success: result.success,
      bank: result.bank,
      error: result.error ?? null,
      accounts: (result.accounts ?? []).map((a: any) => ({
        label: a.label,
        balance: a.balance,
        movements: a.movements ?? [],
      })),
      creditCards: (result.creditCards ?? []).map((c: any) => ({
        label: c.label,
        national: c.national,
        movements: c.movements ?? [],
      })),
    };

    console.log(JSON.stringify(output));
  } catch (err: any) {
    console.log(
      JSON.stringify({
        success: false,
        error: err?.message || "Unknown error",
      })
    );
    process.exit(1);
  }
}

main();

