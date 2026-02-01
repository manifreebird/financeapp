




import { SettingsClient } from "./SettingsClient";

// ─── TYPES ─────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  emoji: string;
  _count?: {
    transactions: number;
  };
}

interface Account {
  id: number;
  name: string;
  bank: string;
  type: string;
  color: string;
  createdAt: string; // Changed from Date to string for static/JSON compatibility
}

interface ConfigPageProps {
  accounts: Account[];
  categories: Category[];
}

// ─── COMPONENT ─────────────────────────────────────

/**
 * Static version of the Config Page.
 * Data is now passed in via props rather than fetched via Prisma.
 */
export default function ConfigPage({ accounts = [], categories = [] }: ConfigPageProps) {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Settings
        </h1>

        <p className="text-sm text-slate-400 mt-0.5">
          Manage your accounts and categories
        </p>
      </div>

      {/* CONTENT */}
      {/* We pass the data down to the Client Component */}
      <SettingsClient accounts={accounts} categories={categories} />
    </div>
  );
}


