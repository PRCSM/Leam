import Link from "next/link";
import { ArrowUpRight, MessageCircle, Ticket, Users, Video, Flower2, Armchair } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { SplitLines } from "@/components/motion/SplitLines";
import { PhoneRow } from "@/components/cards/PhoneCards";
import { CREATORS, TESTIMONIALS } from "@/lib/data";
import { IMG } from "@/lib/images";
import { formatPrice } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Four feature columns (reference row)                               */
/* ------------------------------------------------------------------ */
const FEATURES = [
  { Icon: Ticket, title: "Set your rules", text: "Free for all, tickets, NFTs, subscriptions, custom rules", href: "/memberships" },
  { Icon: Video, title: "Host rooms", text: "Right now, every week, or at random", href: "/features#rooms" },
  { Icon: Users, title: "Share the stage", text: "Invite guests in advance or right on the spot", href: "/features#stage" },
  { Icon: MessageCircle, title: "Keep it going", text: "Hang out in the chat during, before, and after live streams", href: "/features#chat" },
];

export function FeatureRow() {
  return (
    <section className="shell features" aria-label="What a Universe gives you">
      <ul className="grid-4" data-reveal-stagger="0.09">
        {FEATURES.map(({ Icon, title, text, href }) => (
          <li key={title}>
            <Link href={href} className="feature">
              <span className="feature-head">
                <Icon size={15} className="feature-icon" aria-hidden />
                <span className="feature-title">{title}</span>
              </span>
              <span className="feature-text">{text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured universes — four interactive phone mockups                */
/* ------------------------------------------------------------------ */
export function FeaturedUniverses() {
  return (
    <section className="shell phones-section" aria-label="Featured Universes — interactive previews">
      <h2 className="sr-only">Inside a Universe</h2>
      <PhoneRow />
      <p className="phones-hint tiny faint">Tap a screen to try it · interactions run locally in demo mode</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Two editorial benefit statements                                   */
/* ------------------------------------------------------------------ */
export function Benefits() {
  return (
    <section className="shell benefits" aria-label="Why Leam">
      <div className="grid-4">
        <div className="benefit" data-reveal>
          <Sparkle size={16} className="benefit-icon" />
          <p>
            Cut through the noise of social media{" "}
            <br />
            with a special experience
          </p>
        </div>
        <div className="benefit benefit-2" data-reveal>
          <Flower2 size={16} className="benefit-icon" aria-hidden />
          <p>
            Connect deeper with your top 1% fans,{" "}
            <br />
            turn followers into a community
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Creator gallery + editorial card (reference bottom row)            */
/* ------------------------------------------------------------------ */
export function CreatorGallery() {
  const featured = [CREATORS[0], CREATORS[1]];
  return (
    <section className="shell-wide creators-row" aria-label="Featured creators">
      <div className="creators-track" data-reveal-stagger="0.1">
        {featured.map((c) => (
          <Link key={c.slug} href={`/creators/${c.slug}`} className="creator-card" data-cursor="view">
            <Photo src={c.image} alt={`Portrait used for ${c.name} (illustrative photo)`} sizes="(max-width: 700px) 60vw, 300px" className="creator-photo" position="50% 25%" />
            <span className="creator-shade" />
            <span className="creator-meta">
              <span className="creator-name">{c.name}</span>
              <span className="creator-price">
                <Ticket size={12} aria-hidden /> {formatPrice(c.priceCents)}
                {c.priceCents < 2000 ? " a month" : ""}
              </span>
            </span>
          </Link>
        ))}
        <Link href="/blog/light-in-a-rabbit-hole" className="editorial-card" data-cursor="explore">
          <span className="editorial-media">
            <Photo src={IMG.cave} alt="A beam of light falls into a dark cave" sizes="(max-width: 700px) 90vw, 600px" position="50% 40%" />
          </span>
          <span className="editorial-shade" />
          <span className="editorial-pill" aria-hidden>
            <Armchair size={14} />
          </span>
          <span className="editorial-copy">
            <span className="editorial-title">Light in a rabbit hole</span>
            <span className="editorial-text">
              Web3 can be overwhelming. We gotchu.{" "}
              <br />
              We will guide you from here and literally anywhere.
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Expanded homepage — editorial statements                           */
/* ------------------------------------------------------------------ */
export function Manifesto() {
  return (
    <section className="shell section manifesto" aria-labelledby="manifesto-title">
      <span className="eyebrow" data-reveal>
        Built for creative freedom
      </span>
      <SplitLines as="h2" className="display manifesto-title" lines={["Your people.", "Your space.", <>Your rules<Sparkle size={36} className="inline-sparkle" /></>]} />
    </section>
  );
}

const STREAMS = [
  {
    title: "Monthly memberships",
    text: "Recurring tiers with perks you define. Members get every room, the chat and replays.",
    ui: (
      <div className="mini-ui mini-tiers">
        <span>
          Follower <b>Free</b>
        </span>
        <span className="is-on">
          Member <b>$9.99</b>
        </span>
        <span>
          Inner circle <b>$29.97</b>
        </span>
      </div>
    ),
  },
  {
    title: "One-time tickets",
    text: "Sell a single room, a premiere or a season pass. Tickets work alongside memberships.",
    ui: (
      <div className="mini-ui mini-ticket">
        <span className="tiny faint">ADMIT ONE</span>
        <b>Dailies — week 6</b>
        <span className="tiny">Tue · 9pm · $12</span>
      </div>
    ),
  },
  {
    title: "Premium events",
    text: "Workshops, listening parties and 1:1 rooms with limited seats and waitlists.",
    ui: (
      <div className="mini-ui mini-seats">
        {Array.from({ length: 18 }).map((_, i) => (
          <i key={i} className={i < 13 ? "is-taken" : ""} />
        ))}
        <span className="tiny">13 / 18 seats</span>
      </div>
    ),
  },
  {
    title: "Merch as a key",
    text: "An order code from your store can unlock a Universe — the hoodie is the membership card.",
    ui: (
      <div className="mini-ui mini-merch">
        <span className="tiny faint">ORDER #4821</span>
        <b>Unlocks: Inner circle</b>
        <span className="tiny">Valid 12 months</span>
      </div>
    ),
  },
  {
    title: "Exclusive access",
    text: "Invite-only crews, private approvals and collectible-gated rooms when your audience wants them.",
    ui: (
      <div className="mini-ui mini-invite">
        <span className="tiny faint">INVITE CODE</span>
        <b>ANY%-7Q2X</b>
      </div>
    ),
  },
];

export function Monetization() {
  return (
    <section className="shell section monetization" aria-labelledby="money-title">
      <div className="section-head">
        <span className="eyebrow" data-reveal>
          Membership monetization
        </span>
        <SplitLines className="h2" lines={["Get paid by the people", "who show up."]} />
        <p className="lede muted" data-reveal>
          Mix any of these. Creators keep 92% of revenue — fees are listed plainly on the{" "}
          <Link href="/pricing" className="link-underline" style={{ backgroundSize: "100% 1px" }}>
            pricing page
          </Link>
          .
        </p>
      </div>
      <div className="money-grid" data-reveal-stagger="0.07">
        {STREAMS.map((s) => (
          <article key={s.title} className="money-card">
            {s.ui}
            <h3>{s.title}</h3>
            <p className="small muted">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="shell section testimonials" aria-labelledby="t-title">
      <div className="section-head">
        <span className="eyebrow" data-reveal>
          From creators
        </span>
        <h2 id="t-title" className="h2" data-reveal>
          What changes when fans
          <br />
          have a place to go.
        </h2>
        <span className="demo-badge" data-reveal>
          Demonstration copy — fictional creators
        </span>
      </div>
      <div className="t-grid" data-reveal-stagger="0.1">
        {TESTIMONIALS.map((t, i) => (
          <figure key={t.name} className={`t-card t-card-${i}`}>
            <Photo src={t.image} alt="" sizes="(max-width: 900px) 90vw, 360px" className="t-photo" />
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              <b>{t.name}</b>
              <span className="muted small">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="cta-title">
      <div className="final-media" aria-hidden>
        <Photo src={IMG.crowd} alt="" sizes="100vw" position="50% 40%" />
        <div className="final-shade" />
      </div>
      <div className="shell final-inner">
        <SplitLines as="h2" className="display" lines={["Build your own", <>Universe<Sparkle size={44} className="inline-sparkle" /></>]} />
        <div className="final-actions" data-reveal>
          <Link href="/signup" className="btn btn-light btn-lg">
            Create a Universe <ArrowUpRight size={16} />
          </Link>
          <Link href="/explore" className="btn btn-ghost btn-lg">
            Explore Communities
          </Link>
        </div>
      </div>
    </section>
  );
}
