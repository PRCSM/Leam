import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Leam — home">
      <span className="logo-mark" aria-hidden>
        <svg viewBox="0 0 20 20" width="20" height="20">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
          <path d="M11.6 6.2 7.8 10l3.8 3.8" stroke="#050505" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="logo-word">leam</span>
    </Link>
  );
}
