"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Plus, Radio } from "lucide-react";
import { DashHead } from "@/components/dashboard/DashboardShell";
import { StackedBars, Stat } from "@/components/dashboard/Charts";
import { useDashEvents, useDashMembers, useDashUniverses } from "@/components/dashboard/store";
import { Avatar } from "@/components/ui/Photo";
import { REVENUE_SERIES } from "@/lib/data";
import { useDemoSession } from "@/lib/demo-store";

export default function DashboardHome() {
  const [session] = useDemoSession();
  const [unis] = useDashUniverses();
  const [members] = useDashMembers();
  const [events] = useDashEvents();
  const upcoming = [...events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, 4);
  const last = REVENUE_SERIES[REVENUE_SERIES.length - 1];

  return (
    <>
      <DashHead
        title={`Hey ${session?.name.split(" ")[0] ?? "there"}.`}
        sub="Here's how your Universes are doing."
        action={
          <Link href="/dashboard/universes" className="btn btn-light btn-sm">
            <Plus size={14} /> New Universe
          </Link>
        }
      />
      <div className="stat-grid">
        <Stat label="Revenue (Oct)" value={`$${(last.subs + last.tickets + last.merch).toFixed(1)}K`} delta="+18%" />
        <Stat label="Paying members" value={members.filter((m) => m.tier !== "Follower" && m.status === "active").length.toString()} delta="+6%" />
        <Stat label="Universes" value={String(unis.length)} />
        <Stat label="Avg. room attendance" value="184" delta="-3%" />
      </div>
      <div className="dash-cols">
        <div className="panel dash-panel">
          <StackedBars
            title="Revenue by stream"
            data={REVENUE_SERIES}
            xKey="m"
            series={[
              { key: "subs", label: "Memberships" },
              { key: "tickets", label: "Tickets" },
              { key: "merch", label: "Merch" },
            ]}
          />
        </div>
        <div className="panel dash-panel">
          <div className="panel-head">
            <b>
              <CalendarDays size={14} /> Upcoming
            </b>
            <Link href="/dashboard/events" className="tiny muted link-underline">
              All events
            </Link>
          </div>
          <ul className="event-list">
            {upcoming.map((e) => (
              <li key={e.id}>
                <span className="event-date">
                  <b>{new Date(e.date + "T12:00:00").getDate()}</b>
                  <small>{new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}</small>
                </span>
                <span>
                  <b>{e.title}</b>
                  <small className="faint">
                    {e.time} · {e.kind}
                  </small>
                </span>
              </li>
            ))}
            {!upcoming.length && <li className="muted small">Nothing scheduled yet.</li>}
          </ul>
          <Link href="/rooms/bts-monday" className="btn btn-live btn-sm" style={{ marginTop: 12 }}>
            <Radio size={14} /> Open room preview
          </Link>
        </div>
      </div>
      <div className="panel dash-panel">
        <div className="panel-head">
          <b>Newest members</b>
          <Link href="/dashboard/members" className="tiny muted link-underline">
            Manage <ArrowUpRight size={11} style={{ display: "inline" }} />
          </Link>
        </div>
        <ul className="member-strip">
          {[...members].reverse().slice(0, 6).map((m) => (
            <li key={m.id}>
              <Avatar src={m.image} alt="" size={36} />
              <span>
                <b>{m.name}</b>
                <small className="faint">{m.tier}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
