import { use } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { RoomCard } from "@/components/pages/Cards";
import { FollowButton, JoinButton, ShareButton } from "@/components/pages/Actions";
import { SplitLines } from "@/components/motion/SplitLines";
import { CREATORS, ROOMS, getCategory, getCreator, getUniverse } from "@/lib/data";
import { formatCount, formatPrice } from "@/lib/utils";

type Params = { slug: string };
export function generateStaticParams() {
  return CREATORS.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = getCreator((await params).slug);
  return c ? { title: `${c.name} (${c.handle})`, description: c.bio, openGraph: { images: [c.image] } } : {};
}

export default function CreatorPage({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const c = getCreator(slug);
  if (!c) notFound();
  const uni = getUniverse(c.universe)!;
  const rooms = ROOMS.filter((r) => r.host === c.slug);
  const cat = getCategory(c.category)!;
  const [first, ...rest] = c.name.split(" ");

  return (
    <>
      <section className="profile-hero">
        <div className="profile-cover" aria-hidden>
          <div data-parallax="0.1" className="profile-cover-inner">
            <Photo src={c.cover} alt="" sizes="100vw" priority />
          </div>
          <div className="profile-cover-shade" />
        </div>
        <div className="shell profile-head">
          <div className="profile-portrait" data-reveal>
            <Photo src={c.image} alt={`Illustrative portrait for ${c.name}`} sizes="280px" position="50% 25%" />
          </div>
          <div className="profile-id">
            <span className="eyebrow" data-reveal="12">
              <Link href={`/explore/${cat.slug}`} className="link-underline">
                {cat.name}
              </Link>{" "}
              · {c.role}
            </span>
            <SplitLines as="h1" className="display profile-name" lines={[first, rest.join(" ")]} />
            <div className="profile-meta small muted" data-reveal>
              <span>{c.handle}</span>
              <span>
                <MapPin size={12} /> {c.location}
              </span>
              <span>{formatCount(c.followers)} followers</span>
              <span>{formatCount(c.members)} members</span>
            </div>
            <div className="profile-actions" data-reveal>
              <JoinButton slug={uni.slug} />
              <FollowButton id={c.slug} name={c.name} />
              <ShareButton path={`/creators/${c.slug}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="shell section-tight profile-body">
        <div className="profile-bio" data-reveal>
          <h2 className="h3">About</h2>
          <p className="lede">{c.bio}</p>
          <p className="small faint">Demo profile — fictional creator, illustrative photography.</p>
        </div>
        <Link href={`/universes/${uni.slug}`} className="profile-universe" data-cursor="join" data-reveal>
          <Photo src={uni.cover} alt="" sizes="(max-width: 900px) 90vw, 480px" className="pu-photo" />
          <span className="pu-shade" />
          <span className="pu-body">
            <span className="eyebrow">{uni.tagline}</span>
            <b>{uni.title}</b>
            <span className="small">
              {uni.schedule} · from {formatPrice(uni.tiers.find((t) => t.priceCents > 0)?.priceCents ?? 0)}
            </span>
          </span>
          <ArrowUpRight className="pu-arrow" size={18} aria-hidden />
        </Link>
      </section>

      {!!rooms.length && (
        <section className="shell section-tight" aria-labelledby="rooms-h">
          <div className="row-head">
            <h2 id="rooms-h" className="h3">
              Rooms
            </h2>
          </div>
          <div className="room-row" data-reveal-stagger>
            {rooms.map((r) => (
              <RoomCard key={r.id} r={r} />
            ))}
          </div>
        </section>
      )}

      <section className="shell section-tight" aria-labelledby="tiers-h">
        <div className="row-head">
          <h2 id="tiers-h" className="h3">
            Membership
          </h2>
        </div>
        <div className="tier-grid" data-reveal-stagger>
          {uni.tiers.map((t) => (
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
      </section>
    </>
  );
}
