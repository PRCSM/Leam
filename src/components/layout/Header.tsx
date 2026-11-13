"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Photo";
import { GetAppModal } from "./GetAppModal";
import { useDemoSession } from "@/lib/demo-store";
import { IMG } from "@/lib/images";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const QUICK = [
  { href: "/explore", label: "Explore" },
  { href: "/creators", label: "Creators" },
  { href: "/pricing", label: "Pricing" },
];

const MENU = [
  { href: "/explore", label: "Explore", note: "Discover Universes" },
  { href: "/creators", label: "Creators", note: "Who's on Leam" },
  { href: "/features", label: "Features", note: "Rooms, chat, access" },
  { href: "/memberships", label: "Memberships", note: "How creators earn" },
  { href: "/pricing", label: "Pricing", note: "Simple fees" },
  { href: "/blog", label: "Journal", note: "Guides & stories" },
  { href: "/about", label: "About", note: "The collective" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [state, setState] = useState<"top" | "solid" | "hidden">("top");
  const [session] = useDemoSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 40) setState("top");
      else if (y > last + 4 && y > 240) setState("hidden");
      else if (y < last - 4) setState("solid");
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    window.dispatchEvent(new CustomEvent("leam:scroll-lock", { detail: open }));
    if (!open) return;
    const { gsap } = ensureGsap();
    if (!prefersReducedMotion()) {
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll(".menu-link"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.045, duration: 0.8, delay: 0.25, ease: "expo.out" });
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    el.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (isDashboard) return null;

  return (
    <>
      <header className={cn("site-header", `is-${state}`, open && "is-menu-open")} data-hero-intro="nav">
        <div className="site-header-inner">
          <Logo />
          <nav className="header-quick" aria-label="Primary">
            {QUICK.map((q) => (
              <Link key={q.href} href={q.href} className={cn("link-underline", pathname.startsWith(q.href) && "is-current")}>
                {q.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href={session ? "/dashboard" : "/login"} className="header-avatar" aria-label={session ? "Open your dashboard" : "Log in"}>
              <Avatar src={IMG.manJacket} alt="" size={34} />
            </Link>
            <button className="btn btn-light btn-sm header-cta" onClick={() => setAppOpen(true)}>
              Get the app
            </button>
            <button
              className="menu-toggle"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" ref={menuRef} className={cn("site-menu", open && "is-open")} hidden={!open} data-lenis-prevent>
        <div className="shell site-menu-inner">
          <nav aria-label="Site">
            <ul className="menu-list">
              {MENU.map((m) => (
                <li key={m.href} className="menu-item">
                  <Link href={m.href} className="menu-link">
                    <span>{m.label}</span>
                    <small>{m.note}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-aside">
            <Link href="/signup" className="btn btn-light">
              Create a Universe <ArrowUpRight size={16} />
            </Link>
            <Link href={session ? "/dashboard" : "/login"} className="btn btn-ghost">
              {session ? "Dashboard" : "Log in"}
            </Link>
            <div className="menu-small">
              <Link href="/governance">Governance</Link>
              <Link href="/contact">Support</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </div>

      <GetAppModal open={appOpen} onClose={() => setAppOpen(false)} />
    </>
  );
}
