"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/creators", label: "Creators" },
  { href: "/features", label: "Features" },
  { href: "/memberships", label: "Memberships" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Footer() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-word span",
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.04, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".footer-word", start: "top 95%", once: true } }
      );
      gsap.fromTo(
        ".footer-cols > *",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.9, scrollTrigger: { trigger: ".footer-cols", start: "top 98%", once: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, [pathname]);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/rooms/")) return null;

  return (
    <footer ref={ref} className="site-footer">
      <div className="shell">
        <nav className="footer-nav" aria-label="Footer">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="link-underline">
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="footer-word" aria-hidden>
          {"leam".split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </p>
        <div className="grid-4 footer-cols">
          <div className="footer-col">
            <span className="faint">Leam Collective</span>
            <span className="faint">© {new Date().getFullYear()}</span>
          </div>
          <div className="footer-col">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
          <div className="footer-col">
            <Link href="/governance">Governance</Link>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
          <div className="footer-col">
            <Link href="/contact">Support</Link>
            <Link href="/pricing#faq">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
