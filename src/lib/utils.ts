export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function formatPrice(cents: number, suffix?: string) {
  if (cents === 0) return "Free";
  const v = (cents / 100).toFixed(2).replace(/\.00$/, "");
  return `$${v}${suffix ? ` ${suffix}` : ""}`;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leam.example";
