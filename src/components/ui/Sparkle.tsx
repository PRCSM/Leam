import { cn } from "@/lib/utils";

/** Four-point sparkle drawn in SVG so it renders identically on every platform. */
export function Sparkle({ className, size = 24, title }: { className?: string; size?: number; title?: string }) {
  return (
    <svg
      className={cn("sparkle", className)}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M14 2c.6 6.9 3.2 9.5 10 10.2-6.8.7-9.4 3.3-10 10.2-.6-6.9-3.2-9.5-10-10.2C10.8 11.5 13.4 8.9 14 2Z"
        fill="currentColor"
      />
      <path d="M26 19c.3 3.2 1.4 4.3 4.5 4.6-3.1.3-4.2 1.4-4.5 4.6-.3-3.2-1.4-4.3-4.5-4.6 3.1-.3 4.2-1.4 4.5-4.6Z" fill="currentColor" />
      <path d="M25 2.5c.2 1.8.9 2.5 2.7 2.7-1.8.2-2.5.9-2.7 2.7-.2-1.8-.9-2.5-2.7-2.7 1.8-.2 2.5-.9 2.7-2.7Z" fill="currentColor" />
    </svg>
  );
}

/** The ∞ glyph from the reference copy, also as SVG. */
export function InfinityMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="12" viewBox="0 0 40 20" fill="none" aria-hidden>
      <path
        d="M20 10c-3.6-4.6-6.3-7-10-7a7 7 0 1 0 0 14c3.7 0 6.4-2.4 10-7Zm0 0c3.6 4.6 6.3 7 10 7a7 7 0 1 0 0-14c-3.7 0-6.4 2.4-10 7Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
