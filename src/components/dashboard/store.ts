"use client";

import { MEMBERS, UNIVERSES, type AccessMode, type CategorySlug, type Tier } from "@/lib/data";
import { useDemoState } from "@/lib/demo-store";
import { IMG } from "@/lib/images";

/* Local, browser-only dashboard data for DEMO MODE. */

export type DashUniverse = {
  id: string;
  title: string;
  tagline: string;
  category: CategorySlug;
  access: AccessMode;
  schedule: string;
  cover: string;
  members: number;
  tiers: Tier[];
  published: boolean;
  slowMode: boolean;
  keywordFilter: string;
};

const seedUniverse = UNIVERSES[0];
export const SEED_UNIVERSES: DashUniverse[] = [
  {
    id: seedUniverse.slug,
    title: seedUniverse.title,
    tagline: seedUniverse.tagline,
    category: seedUniverse.category,
    access: seedUniverse.access,
    schedule: seedUniverse.schedule,
    cover: seedUniverse.cover,
    members: seedUniverse.members,
    tiers: seedUniverse.tiers,
    published: true,
    slowMode: false,
    keywordFilter: "",
  },
];

export type DashMember = (typeof MEMBERS)[number] & { status: string; tier: string };
export type DashEvent = { id: string; title: string; universe: string; date: string; time: string; kind: "room" | "ticketed" | "premium"; priceCents: number; capacity: number };

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
export const SEED_EVENTS: DashEvent[] = [
  { id: "e1", title: "Behind the Scenes — Ep. 113", universe: seedUniverse.slug, date: inDays(3), time: "10:00", kind: "room", priceCents: 0, capacity: 0 },
  { id: "e2", title: "Listener stage: hot takes", universe: seedUniverse.slug, date: inDays(6), time: "20:00", kind: "room", priceCents: 0, capacity: 0 },
  { id: "e3", title: "Live taping with a guest", universe: seedUniverse.slug, date: inDays(12), time: "19:00", kind: "ticketed", priceCents: 1500, capacity: 300 },
];

export const useDashUniverses = () => useDemoState<DashUniverse[]>("dash:universes", SEED_UNIVERSES);
export const useDashMembers = () => useDemoState<DashMember[]>("dash:members", MEMBERS as unknown as DashMember[]);
export const useDashEvents = () => useDemoState<DashEvent[]>("dash:events", SEED_EVENTS);

export const COVER_CHOICES = [IMG.crowd, IMG.womanStreet, IMG.drumsWarm, IMG.womanCloak, IMG.parisDusk, IMG.manGrid, IMG.onAir, IMG.cave];
