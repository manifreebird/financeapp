
// ─── BASE FORMATTER ─────────────────────────

function formatCurrencyBase(amount: number, locale = "en-US") {
  return Math.abs(amount).toLocaleString(locale);
}

// ─── STANDARD FORMAT ($123 / -$123) ─────────

export function formatCurrency(amount: number): string {
  const formatted = formatCurrencyBase(amount);
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

// ─── SIGNED FORMAT (+$123 / -$123) ──────────

export function formatSignedCurrency(amount: number): string {
  const formatted = formatCurrencyBase(amount);
  return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
}