import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, type, categoryId, accountId } = body;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        categoryId,
        accountId,
      },
    });

    // Update account balance
    if (type === "INCOME") {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: { increment: amount },
        },
      });
    } else {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: { decrement: amount },
        },
      });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}