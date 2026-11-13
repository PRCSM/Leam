"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, KeyRound, Lock, Repeat, Search, Ticket, Users, X } from "lucide-react";
import { Photo, Avatar } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { SplitLines } from "@/components/motion/SplitLines";
import { LiveRoom } from "@/components/room/LiveRoom";
import { MembershipPhone, StagePhone, ChatPhone, LivePhone } from "@/components/cards/PhoneCards";
import { ACCESS_MODES, CATEGORIES, UNIVERSES, getCreator, type AccessMode } from "@/lib/data";
import { IMG } from "@/lib/images";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn, formatCount } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Access modes — selecting an option updates the live preview        */
/* ------------------------------------------------------------------ */
const MODE_ICON: Record<AccessMode, typeof Globe> = { public: Globe, private: Lock, ticketed: Ticket, subscription: Repeat, invite: KeyRound };
const MODE_STATE: Record<AccessMode, { gate: string; chat: string; members: string }> = {
  public: { gate: "Open door", chat: "Anyone can read · members post", members: "12.4K visitors this week" },
  private: { gate: "Approval queue · 14 pending", chat: "Members only", members: "640 approved" },
  ticketed: { gate: "Ticket checked at the door", chat: "Ticket holders during the event", members: "312 tickets sold" },
  subscription: { gate: "Active membership required", chat: "Members only", members: "2,410 members" },
  invite: { gate: "Invite code required", chat: "Crew only", members: "Wave 3 · 180 seats" },
};

export function AccessModes() {
  const [mode, setMode] = useState<AccessMode>("subscription");
  const preview = useRef<HTMLDivElement>(null);
  const info = ACCESS_MODES.find((m) => m.id === mode)!;
  const state = MODE_STATE[mode];
  const Icon = MODE_ICON[mode];

  useEffect(() => {
    if (prefersReducedMotion() || !preview.current) return;
    const { gsap } = ensureGsap();
    gsap.fromTo(preview.current.querySelectorAll("[data-swap]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "expo.out" });
  }, [mode]);

  return (
    <section className="shell section access" aria-labelledby="access-title">
      <div className="access-copy">
        <span className="eyebrow" data-reveal>
          Access, your way
        </span>
        <SplitLines className="h2" lines={["Decide who", "gets in."]} />
        <p className="lede muted" data-reveal>
          Every Universe has a door. Pick how it opens — and change it whenever your community changes.
        </p>
        <div className="access-options" role="radiogroup" aria-label="Access model" data-reveal-stagger="0.05">
          {ACCESS_MODES.map((m) => {
            const I = MODE_ICON[m.id];
            return (
              <button key={m.id} role="radio" aria-checked={mode === m.id} className={cn("access-opt", mode === m.id && "is-active")} onClick={() => setMode(m.id)}>
                <I size={16} aria-hidden />
                <span>
                  <b>{m.label}</b>
                  <small>{m.detail}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="access-preview" ref={preview} aria-live="polite" data-reveal>
        <div className="ap-cover">
          <Photo src={IMG.womanStreet} alt="" sizes="(max-width: 900px) 90vw, 480px" position="50% 30%" />
          <div className="ap-cover-shade" />
          <span className="ap-mode" data-swap>
            <Icon size={13} /> {info.label}
          </span>
          <div className="ap-title">
            <span className="tiny">Amara Vale</span>
            <strong>Behind the Seams</strong>
          </div>
        </div>
        <dl className="ap-rows">
          <div data-swap>
            <dt>Door</dt>
            <dd>{state.gate}</dd>
          </div>
          <div data-swap>
            <dt>Chat</dt>
            <dd>{state.chat}</dd>
          </div>
          <div data-swap>
            <dt>Community</dt>
            <dd>{state.members}</dd>
          </div>
        </dl>
        {mode === "invite" ? (
          <div className="ap-invite" data-swap>
            <input className="input" placeholder="Enter invite code" aria-label="Invite code (demo)" />
            <button className="btn btn-light">Enter</button>
          </div>
        ) : (
          <button className="btn btn-light ap-cta" data-swap>
            {info.cta}
          </button>
        )}
        <span className="tiny faint ap-note">Preview only · no account or payment involved</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Live together — embedded live room demo                            */
/* ------------------------------------------------------------------ */
export function LiveTogether() {
  return (
    <section className="section live-together" aria-labelledby="live-title">
      <div className="shell">
        <div className="section-head section-head-row">
          <div>
            <span className="eyebrow" data-reveal>
              Live together
            </span>
            <SplitLines className="h2" lines={["Rooms that feel", "like being there."]} />
          </div>
          <p className="lede muted" data-reveal>
            Host video, bring people on stage, react in real time and keep the chat rolling. Try it — request to speak and the host will bring you up.
          </p>
        </div>
        <div data-reveal>
          <LiveRoom roomId="bts-monday" compact />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Community discovery — search + category + access filters          */
/* ------------------------------------------------------------------ */
export function UniverseDirectory({ initialCategory = "all", showHeading = true, limit }: { initialCategory?: string; showHeading?: boolean; limit?: number }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(initialCategory);
  const [access, setAccess] = useState<AccessMode | "all">("all");
  const grid = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return UNIVERSES.filter((u) => {
      const creator = getCreator(u.creator)!;
      const hay = `${u.title} ${u.tagline} ${u.description} ${creator.name} ${u.category}`.toLowerCase();
      return (cat === "all" || u.category === cat) && (access === "all" || u.access === access) && (!needle || hay.includes(needle));
    });
  }, [q, cat, access]);

  useEffect(() => {
    if (prefersReducedMotion() || !grid.current) return;
    const { gsap } = ensureGsap();
    gsap.fromTo(grid.current.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: "expo.out" });
  }, [results]);

  const shown = limit ? results.slice(0, limit) : results;

  return (
    <div className="directory">
      {showHeading && (
        <div className="section-head section-head-row">
          <div>
            <span className="eyebrow" data-reveal>
              Community discovery
            </span>
            <SplitLines className="h2" lines={["Find your", "people."]} />
          </div>
          <Link href="/explore" className="btn btn-ghost" data-reveal>
            Browse everything <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
      <div className="dir-controls">
        <label className="dir-search">
          <Search size={16} aria-hidden />
          <span className="sr-only">Search communities</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search creators, topics, Universes" />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </label>
        <select className="select dir-access" value={access} onChange={(e) => setAccess(e.target.value as AccessMode | "all")} aria-label="Filter by access">
          <option value="all">Any access</option>
          {ACCESS_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div className="dir-cats" role="group" aria-label="Filter by category" data-lenis-prevent>
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
        {results.length} {results.length === 1 ? "Universe" : "Universes"}
      </p>
      <div className="dir-grid" ref={grid}>
        {shown.map((u) => {
          const c = getCreator(u.creator)!;
          return (
            <Link key={u.slug} href={`/universes/${u.slug}`} className="uni-card" data-cursor="join">
              <Photo src={u.cover} alt="" sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 340px" className="uni-cover" />
              <span className="uni-shade" />
              <span className="uni-top">
                <span className="chip uni-access">{ACCESS_MODES.find((m) => m.id === u.access)!.label}</span>
              </span>
              <span className="uni-body">
                <span className="uni-creator">
                  <Avatar src={c.image} alt="" size={22} /> {c.name}
                </span>
                <b>{u.title}</b>
                <span className="small muted">{u.tagline}</span>
                <span className="uni-meta tiny">
                  <Users size={11} /> {formatCount(u.members)} · {u.schedule}
                </span>
              </span>
            </Link>
          );
        })}
        {!shown.length && (
          <div className="dir-empty">
            <p>No Universes match that yet.</p>
            <button className="btn btn-ghost btn-sm" onClick={() => (setQ(""), setCat("all"), setAccess("all"))}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Discovery() {
  return (
    <section className="section discovery" aria-label="Community discovery">
      <Marquee />
      <div className="shell">
        <UniverseDirectory limit={6} />
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...CATEGORIES, ...CATEGORIES];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {items.map((c, i) => (
          <span key={i}>
            {c.name}
            <Sparkle size={18} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works — sticky storytelling                                 */
/* ------------------------------------------------------------------ */
const STEPS = [
  { n: "01", title: "Create your Universe", text: "Name it, pick a cover, write the welcome. It takes about two minutes.", Phone: MembershipPhone },
  { n: "02", title: "Customize access", text: "Free, ticketed, subscription, invite-only — or a mix. Change it any time.", Phone: ChatPhone },
  { n: "03", title: "Invite your audience", text: "Share one link everywhere you already post. Fans join in a tap.", Phone: StagePhone },
  { n: "04", title: "Host and grow", text: "Go live, bring people on stage, and let the chat carry the energy between rooms.", Phone: LivePhone },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const { ScrollTrigger } = ensureGsap();
    const el = root.current!;
    const triggers = Array.from(el.querySelectorAll<HTMLElement>(".hiw-step")).map((step, i) =>
      ScrollTrigger.create({ trigger: step, start: "top 60%", end: "bottom 60%", onToggle: (self) => self.isActive && setActive(i) })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    gsap.fromTo(`.hiw-visual .hiw-phone`, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" });
  }, [active]);

  const { Phone } = STEPS[active];

  return (
    <section ref={root} className="shell section hiw" aria-labelledby="hiw-title">
      <div className="hiw-copy">
        <span className="eyebrow" data-reveal>
          How it works
        </span>
        <h2 id="hiw-title" className="h2" data-reveal>
          Four steps to
          <br />a place of your own.
        </h2>
        <ol className="hiw-steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className={cn("hiw-step", i === active && "is-active")}>
              <button onClick={() => setActive(i)} aria-current={i === active ? "step" : undefined}>
                <span className="hiw-n">{s.n}</span>
                <span>
                  <b>{s.title}</b>
                  <span className="muted">{s.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="hiw-visual" aria-hidden>
        <div className="hiw-sticky">
          <div className="hiw-glow" />
          <div className="hiw-phone" key={active}>
            <Phone interactive={false} />
          </div>
          <div className="hiw-dots">
            {STEPS.map((s, i) => (
              <i key={s.n} className={i === active ? "on" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
