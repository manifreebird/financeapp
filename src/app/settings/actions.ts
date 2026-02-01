


"use server";

import { revalidatePath } from "next/cache";

// ─── CREATE ACCOUNT ───────────────────────────────

export async function createAccount(formData: FormData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const bank = formData.get("bank")?.toString().trim();
    const type = formData.get("type")?.toString().trim();
    const color = formData.get("color")?.toString().trim() || "#6366f1";

    if (!name || !bank || !type) {
      throw new Error("Missing required fields");
    }

    const allowedTypes = ["checking", "savings", "credit_card"];
    if (!allowedTypes.includes(type)) {
      throw new Error("Invalid account type");
    }

    /**
     * STATIC MODE: 
     * In a real app, you would use fetch() here to send data to your API.
     * For now, we just log the data and return success.
     */
    console.log("Account to create:", { name, bank, type, color });

    revalidatePath("/config");

    return { 
      success: true, 
      data: { name, bank, type, color, balance: 0 } 
    };
  } catch (err: any) {
    console.error("Create account error:", err);
    return { success: false, error: err?.message || "Failed to create account" };
  }
}

// ─── DELETE ACCOUNT ───────────────────────────────

export async function deleteAccount(id: number) {
  try {
    if (!id) {
      throw new Error("Invalid account ID");
    }

    /**
     * STATIC MODE:
     * Logic for database deletion removed.
     */
    console.log("Deleting account with ID:", id);

    revalidatePath("/config");

    return { success: true };
  } catch (err: any) {
    console.error("Delete account error:", err);
    return { success: false, error: err?.message || "Failed to delete account" };
  }
}

// ─── CREATE CATEGORY ─────────────────────────────

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const emoji = formData.get("emoji")?.toString().trim() || "📌";

    if (!name) {
      throw new Error("Category name is required");
    }

    /**
     * STATIC MODE:
     * Database creation logic removed.
     */
    console.log("Category to create:", { name, emoji });

    revalidatePath("/config");

    return { 
      success: true, 
      data: { name, emoji } 
    };
  } catch (err: any) {
    console.error("Create category error:", err);
    return { success: false, error: err?.message || "Failed to create category" };
  }
}