import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Using the fixed db.ts

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Setu sends different 'types' of notifications. 
    // We care about 'FI_NOTIFICATION' (Financial Information)
    if (payload.type === "FI_NOTIFICATION" && payload.status === "SUCCESS") {
      const { data, consentId } = payload;

      // 1. Find the user associated with this consent
      const user = await prisma.user.findFirst({
        where: { setuConsentId: consentId }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // 2. Save the new transactions into the database
      // Using 'upsert' ensures we don't save the same transaction twice
      await Promise.all(data.transactions.map(async (txn: any) => {
        await prisma.transaction.upsert({
          where: { externalId: txn.id }, // Assume Setu provides a unique ID
          update: {}, // Don't change if it exists
          create: {
            externalId: txn.id,
            amount: txn.amount,
            description: txn.description,
            date: new Date(txn.timestamp),
            userId: user.id,
            category: "Other" // You can use your guessCategory function here!
          }
        });
      }));

      return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "Notification received" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}