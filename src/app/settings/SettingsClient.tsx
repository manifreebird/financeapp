


"use client";

import { useState, useRef } from "react";
import { createAccount, deleteAccount, createCategory } from "./actions";

// ─── CONSTANTS ─────────────────────────

const BANKS = [
  "Banco de Chile",
  "BancoEstado",
  "Santander",
  "BCI",
  "Scotiabank",
  "Itaú",
  "Other",
];

const ACCOUNT_TYPES = ["checking", "savings", "credit_card"]; 

const COLOR_SWATCHES = [
  "#6366f1",
  "#a78bfa",
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
];

type Tab = "banks" | "accounts" | "categories";

interface Account {
  id: number;
  name: string;
  bank: string;
  type: string;
  color: string;
}

interface Category {
  id: number;
  name: string;
  emoji: string;
  _count: { transactions: number };
}

interface Props {
  accounts: Account[];
  categories: Category[];
}

// ─── MAIN COMPONENT ─────────────────────────

export function SettingsClient({ accounts, categories }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("accounts");
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const accountFormRef = useRef<HTMLFormElement>(null);
  const categoryFormRef = useRef<HTMLFormElement>(null);

  async function handleCreateAccount(formData: FormData) {
    formData.set("color", selectedColor);
    setIsPending(true);

    const res = await createAccount(formData);

    if (!res?.success) {
      alert(res?.error || "Failed to create account");
    } else {
      accountFormRef.current?.reset();
      setShowAccountForm(false);
    }

    setIsPending(false);
  }

  async function handleDeleteAccount(id: number) {
    if (!confirm("Are you sure you want to delete this account?")) return;

    setIsPending(true);

    const res = await deleteAccount(id);

    if (!res?.success) {
      alert(res?.error || "Failed to delete account");
    }

    setIsPending(false);
  }

  async function handleCreateCategory(formData: FormData) {
    setIsPending(true);

    const res = await createCategory(formData);

    if (!res?.success) {
      alert(res?.error || "Failed to create category");
    } else {
      categoryFormRef.current?.reset();
    }

    setIsPending(false);
  }

  return (
    <div className="flex gap-6 min-h-[500px] text-white">

      {/* SIDEBAR */}
      <aside className="w-[220px]">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2">
          {(["banks", "accounts", "categories"] as Tab[]).map((tab) => {
            const labels = {
              banks: "Connect Bank",
              accounts: "Accounts",
              categories: "Categories",
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  activeTab === tab
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1">
        {activeTab === "accounts" && (
          <AccountsPanel
            accounts={accounts}
            showForm={showAccountForm}
            setShowForm={setShowAccountForm}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            formRef={accountFormRef}
            isPending={isPending}
            onCreateAccount={handleCreateAccount}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        {activeTab === "categories" && (
          <CategoriesPanel
            categories={categories}
            formRef={categoryFormRef}
            isPending={isPending}
            onCreateCategory={handleCreateCategory}
          />
        )}

        {activeTab === "banks" && <BanksPanel />}
      </div>
    </div>
  );
}

// ─── ACCOUNTS PANEL ─────────────────────────

interface AccountsPanelProps {
  accounts: Account[];
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  formRef: React.RefObject<HTMLFormElement>;
  isPending: boolean;
  onCreateAccount: (formData: FormData) => void;
  onDeleteAccount: (id: number) => void;
}

function AccountsPanel({
  accounts,
  showForm,
  setShowForm,
  selectedColor,
  setSelectedColor,
  formRef,
  isPending,
  onCreateAccount,
  onDeleteAccount,
}: AccountsPanelProps) {
  return (
    <div className="flex flex-col gap-5">

      <h2 className="text-xl font-semibold">Accounts</h2>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-500 px-4 py-2 rounded"
        >
          + Add Account
        </button>
      )}

      {showForm && (
        <form
          ref={formRef}
          action={onCreateAccount}
          className="flex flex-col gap-3 bg-slate-900 p-4 rounded"
        >
          <input name="name" placeholder="Account name" required className="p-2 bg-slate-800 rounded" />

          <select name="bank" required className="p-2 bg-slate-800 rounded">
            <option value="">Select bank</option>
            {BANKS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select name="type" required className="p-2 bg-slate-800 rounded">
            <option value="">Select type</option>
            {ACCOUNT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <div className="flex gap-2">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                style={{ background: c }}
                className={`w-6 h-6 rounded ${
                  selectedColor === c ? "ring-2 ring-white" : ""
                }`}
              />
            ))}
          </div>

          <button disabled={isPending} className="bg-green-500 p-2 rounded">
            {isPending ? "Saving..." : "Create"}
          </button>
        </form>
      )}

      {accounts.map((a) => (
        <div key={a.id} className="flex justify-between bg-slate-900 p-3 rounded">
          <span>{a.name}</span>
          <button
            disabled={isPending}
            onClick={() => onDeleteAccount(a.id)}
            className="text-red-400"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── CATEGORIES PANEL ─────────────────────────

interface CategoriesPanelProps {
  categories: Category[];
  formRef: React.RefObject<HTMLFormElement>;
  isPending: boolean;
  onCreateCategory: (formData: FormData) => void;
}

function CategoriesPanel({
  categories,
  formRef,
  isPending,
  onCreateCategory,
}: CategoriesPanelProps) {
  return (
    <div className="flex flex-col gap-5">

      <h2 className="text-xl font-semibold">Categories</h2>

      <form ref={formRef} action={onCreateCategory} className="flex gap-2">
        <input name="name" placeholder="Category name" required className="p-2 bg-slate-800 rounded" />
        <input name="emoji" placeholder="📌" className="p-2 bg-slate-800 rounded w-16" />
        <button disabled={isPending} className="bg-indigo-500 px-4">
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>

      {categories.map((c) => (
        <div key={c.id} className="bg-slate-900 p-3 rounded flex justify-between">
          <span>{c.emoji} {c.name}</span>
          <span className="text-slate-400">{c._count.transactions}</span>
        </div>
      ))}
    </div>
  );
}

// ─── BANK PANEL ─────────────────────────

function BanksPanel() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Connect Bank</h2>
      <p className="text-slate-400">Bank sync UI coming soon</p>
    </div>
  );
}















