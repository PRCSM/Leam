"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { DashHead } from "@/components/dashboard/DashboardShell";
import { useDashMembers } from "@/components/dashboard/store";
import { Avatar } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

const TIERS = ["All", "Follower", "Member", "Inner circle"];
const STATUS_LABEL: Record<string, string> = { active: "Active", muted: "Muted", pending: "Pending approval", banned: "Removed" };

export default function MembersPage() {
  const [members, setMembers] = useDashMembers();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("All");
  const [menu, setMenu] = useState<string | null>(null);

  const list = useMemo(
    () => members.filter((m) => (tier === "All" || m.tier === tier) && `${m.name} ${m.email}`.toLowerCase().includes(q.toLowerCase())),
    [members, q, tier]
  );
  const update = (id: string, patch: Partial<(typeof members)[number]>) => {
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setMenu(null);
  };

  return (
    <>
      <DashHead title="Members" sub={`${members.length} people · moderation actions are logged`} />
      <div className="dir-controls">
        <label className="dir-search">
          <Search size={16} aria-hidden />
          <span className="sr-only">Search members</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" />
        </label>
      </div>
      <div className="dir-cats" role="group" aria-label="Filter by tier" style={{ marginBottom: 16 }}>
        {TIERS.map((t) => (
          <button key={t} className="chip" aria-pressed={tier === t} onClick={() => setTier(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="panel table-wrap" data-lenis-prevent>
        <table className="data-table members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Tier</th>
              <th>Joined</th>
              <th>Status</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>
                  <span className="member-cell">
                    <Avatar src={m.image} alt="" size={30} />
                    <span>
                      <b>{m.name}</b>
                      <small className="faint">{m.email}</small>
                    </span>
                  </span>
                </td>
                <td>
                  <select className="select select-sm" value={m.tier} onChange={(e) => update(m.id, { tier: e.target.value })} aria-label={`Tier for ${m.name}`}>
                    {TIERS.slice(1).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </td>
                <td className="faint">{new Date(m.joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                <td>
                  <span className={cn("status", `status-${m.status}`)}>{STATUS_LABEL[m.status]}</span>
                </td>
                <td className="row-actions">
                  <button className="icon-btn" aria-label={`Actions for ${m.name}`} aria-expanded={menu === m.id} onClick={() => setMenu(menu === m.id ? null : m.id)}>
                    <MoreHorizontal size={15} />
                  </button>
                  {menu === m.id && (
                    <div className="menu-pop" role="menu">
                      {m.status === "pending" && (
                        <button role="menuitem" onClick={() => update(m.id, { status: "active" })}>
                          Approve
                        </button>
                      )}
                      {m.status !== "muted" ? (
                        <button role="menuitem" onClick={() => update(m.id, { status: "muted" })}>
                          Mute in chat
                        </button>
                      ) : (
                        <button role="menuitem" onClick={() => update(m.id, { status: "active" })}>
                          Unmute
                        </button>
                      )}
                      {m.status !== "banned" ? (
                        <button role="menuitem" className="danger" onClick={() => update(m.id, { status: "banned" })}>
                          Remove from Universe
                        </button>
                      ) : (
                        <button role="menuitem" onClick={() => update(m.id, { status: "active" })}>
                          Restore
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={5} className="muted">
                  No members match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
