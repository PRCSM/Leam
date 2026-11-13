import { use } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { Photo, Avatar } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { RoomCard } from "@/components/pages/Cards";
import { JoinButton, ShareButton } from "@/components/pages/Actions";
import { ChatPanel } from "@/components/room/LiveRoom";
import { SplitLines } from "@/components/motion/SplitLines";
import { ACCESS_MODES, MEMBERS, ROOMS, UNIVERSES, getCreator, getUniverse } from "@/lib/data";
import { formatCount, formatPrice } from "@/lib/utils";

type Params = { slug: string };
export function generateStaticParams() {
  return UNIVERSES.map((u) => ({ slug: u.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const u = getUniverse((await params).slug);
  return u ? { title: `${u.title} — a Universe by ${getCreator(u.creator)?.name}`, description: u.description, openGraph: { images: [u.cover] } } : {};
}

export default function UniversePage({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const u = getUniverse(slug);
  if (!u) notFound();
  const c = getCreator(u.creator)!;
  const rooms = ROOMS.filter((r) => r.universe === u.slug);
  const access = ACCESS_MODES.find((m) => m.id === u.access)!;

  return (
    <>
      <section className="uni-hero">
        <div className="uni-hero-media" aria-hidden>
          <div className="uni-hero-photo" data-zoom>
            <Photo src={u.cover} alt="" sizes="100vw" priority />
          </div>
          <div className="uni-hero-shade" />
        </div>
        <div className="shell uni-hero-inner">
          <Link href={`/creators/${c.slug}`} className="uni-hero-creator" data-reveal="12">
            <Avatar src={c.image} alt="" size={28} /> {c.name}
          </Link>
          <SplitLines as="h1" className="display" lines={[<>{u.title}<Sparkle size={40} className="inline-sparkle" /></>]} />
          <p className="lede" data-reveal>
            {u.description}
          </p>
          <div className="uni-hero-actions" data-reveal>
            <JoinButton slug={u.slug} className="btn-lg" />
            <ShareButton path={`/universes/${u.slug}`} />
          </div>
        </div>
      </section>

      <section className="shell uni-facts" aria-label="At a glance">
        <dl className="grid-4" data-reveal-stagger>
          <div>
            <dt>
              <ShieldCheck size={14} /> Access
            </dt>
            <dd>{access.label}</dd>
            <span className="tiny faint">{access.detail}</span>
          </div>
          <div>
            <dt>
              <CalendarClock size={14} /> Schedule
            </dt>
            <dd>{u.schedule}</dd>
            <span className="tiny faint">Since {u.since}</span>
          </div>
          <div>
            <dt>
              <Users size={14} /> Community
            </dt>
            <dd>{formatCount(u.members)}</dd>
            <span className="tiny faint">members & ticket holders</span>
          </div>
          <div>
            <dt>
              <MessageCircle size={14} /> Chat
            </dt>
            <dd>Always open</dd>
            <span className="tiny faint">before, during & after rooms</span>
          </div>
        </dl>
      </section>

      <section className="shell section-tight uni-split">
        <div className="uni-left">
          <div className="row-head">
            <h2 className="h3">Rooms</h2>
          </div>
          <div className="room-row is-wrap" data-reveal-stagger>
            {rooms.map((r) => (
              <RoomCard key={r.id} r={r} />
            ))}
          </div>

          <div className="row-head" style={{ marginTop: 48 }}>
            <h2 className="h3">Access</h2>
          </div>
          <div className="tier-grid" data-reveal-stagger>
            {u.tiers.map((t) => (
              <article key={t.id} className="tier-card">
                <span className="small muted">{t.name}</span>
                <b className="tier-price">
                  {formatPrice(t.priceCents)}
                  {t.priceCents > 0 && <small>{t.interval === "month" ? "/mo" : " once"}</small>}
                </b>
                <ul>
                  {t.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="row-head" style={{ marginTop: 48 }}>
            <h2 className="h3">Members</h2>
            <span className="tiny faint">{formatCount(u.members)}</span>
          </div>
          <div className="avatar-stack" data-reveal>
            {MEMBERS.slice(0, 7).map((m) => (
              <Avatar key={m.id} src={m.image} alt="" size={40} ring />
            ))}
            <span className="small muted">and {formatCount(u.members - 7)} more</span>
          </div>
        </div>
        <div className="uni-right" data-reveal>
          <ChatPanel storageKey={`universe:${u.slug}`} title="Community chat" />
          <p className="tiny faint" style={{ marginTop: 8 }}>
            Demo chat — messages stay in this browser.
          </p>
        </div>
      </section>
    </>
  );
}
