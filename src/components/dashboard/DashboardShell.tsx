"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarDays, LayoutGrid, LogOut, Orbit, Users } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Photo";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { useDemoSession, useMounted } from "@/lib/demo-store";
import { IMG } from "@/lib/images";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", Icon: LayoutGrid },
  { href: "/dashboard/universes", label: "Universes", Icon: Orbit },
  { href: "/dashboard/members", label: "Members", Icon: Users },
  { href: "/dashboard/events", label: "Events", Icon: CalendarDays },
  { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart3 },
];

/**
 * Creator dashboard frame. Access is gated on the DEMO session; in production
 * replace this check with middleware against your auth provider.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const [session, setSession, hydrated] = useDemoSession();

  if (!mounted || !hydrated) return <div className="dash-loading" aria-busy="true" />;

  if (!session)
    return (
      <section className="dash-gate">
        <Logo />
        <h1 className="h2">Creator dashboard</h1>
        <p className="muted">Log in to manage your Universes. In this build sign-in is a local demo — no account is created.</p>
        <div className="final-actions">
          <Link href="/login" className="btn btn-light">
            Log in
          </Link>
          <button className="btn btn-ghost" onClick={() => setSession({ name: "Demo Creator", email: "demo@leam.example", role: "creator" })}>
            Try the demo dashboard
          </button>
        </div>
      </section>
    );

  return (
    <div className="dash">
      <aside className="dash-side">
        <Logo />
        <nav aria-label="Dashboard">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={cn("dash-link", active && "is-active")} aria-current={active ? "page" : undefined}>
                <Icon size={16} /> <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="dash-user">
          <Avatar src={IMG.manJacket} alt="" size={32} />
          <span>
            <b>{session.name}</b>
            <small className="faint">{session.email}</small>
          </span>
          <button
            className="icon-btn"
            aria-label="Log out"
            onClick={() => {
              setSession(null);
              router.push("/");
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>
      <div className="dash-main">
        <div className="dash-topbar">
          <DemoBadge label="Demo data · stored in this browser" />
          <Link href="/" className="small muted link-underline">
            View site
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DashHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <header className="dash-head">
      <div>
        <h1 className="h2">{title}</h1>
        {sub && <p className="muted small">{sub}</p>}
      </div>
      {action}
    </header>
  );
}
