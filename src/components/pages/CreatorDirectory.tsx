"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CreatorCard } from "./Cards";
import { CATEGORIES, CREATORS } from "@/lib/data";

type Sort = "popular" | "price-asc" | "price-desc" | "name";

export function CreatorDirectory() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState<Sort>("popular");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    const filtered = CREATORS.filter(
      (c) => (cat === "all" || c.category === cat) && (!n || `${c.name} ${c.role} ${c.location} ${c.handle}`.toLowerCase().includes(n))
    );
    const sorters: Record<Sort, (a: (typeof CREATORS)[number], b: (typeof CREATORS)[number]) => number> = {
      popular: (a, b) => b.members - a.members,
      "price-asc": (a, b) => a.priceCents - b.priceCents,
      "price-desc": (a, b) => b.priceCents - a.priceCents,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...filtered].sort(sorters[sort]);
  }, [q, cat, sort]);

  return (
    <div className="directory">
      <div className="dir-controls">
        <label className="dir-search">
          <Search size={16} aria-hidden />
          <span className="sr-only">Search creators</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, craft or city" />
        </label>
        <select className="select dir-access" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort creators">
          <option value="popular">Most members</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      <div className="dir-cats" role="group" aria-label="Filter by category">
        <button className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.slug} className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}>
            {c.name}
          </button>
        ))}
      </div>
      <p className="tiny faint dir-count" aria-live="polite">
        {list.length} creators
      </p>
      <div className="creator-grid">
        {list.map((c) => (
          <CreatorCard key={c.slug} c={c} />
        ))}
        {!list.length && <p className="muted">No creators match — try another category.</p>}
      </div>
    </div>
  );
}
