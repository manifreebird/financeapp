"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── NAV CONFIG ─────────────────────────

const tabs = [
  { name: "Dashboard", href: "/" },
  { name: "Transactions", href: "/transactions" },
  { name: "Accounts", href: "/accounts" },
  { name: "Settings", href: "/settings" },
];

// ─── COMPONENT ─────────────────────────

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(15,23,42,0.85)] backdrop-blur-xl border-b border-slate-800 px-6 md:px-10 py-3.5 flex justify-between items-center">

      {/* LOGO */}
      <Link href="/" className="flex items-center gap-3 no-underline group">
        <div className="w-10 h-10 rounded-[11px] bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.6)] group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 46 32" fill="none" className="w-[22px] h-[22px]">
            <rect x="0" y="6" width="46" height="26" rx="5" stroke="#fff" strokeWidth="2.5" />
            <path d="M7 6V3a5 5 0 015-5h22a5 5 0 015 5v3" stroke="#fff" strokeWidth="2.5" />
            <circle cx="36" cy="19" r="4" stroke="#fff" strokeWidth="2" />
            <line x1="36" y1="16.5" x2="36" y2="21.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex flex-col">
          <span className="font-[family-name:var(--font-caveat)] text-2xl font-semibold text-white leading-none">
            My Finance
          </span>
          <span className="text-[10px] text-slate-400 tracking-wider mt-0.5">
            your money, your control
          </span>
        </div>
      </Link>

      {/* NAV TABS */}
      <div className="hidden md:flex gap-1.5">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* MOBILE MENU (basic placeholder) */}
      <div className="md:hidden">
        <span className="text-slate-400 text-sm">Menu</span>
      </div>
    </nav>
  );
}