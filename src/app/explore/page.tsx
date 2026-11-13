import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { RoomCard } from "@/components/pages/Cards";
import { Photo } from "@/components/ui/Photo";
import { UniverseDirectory } from "@/components/home/Interactive";
import { CATEGORIES, ROOMS } from "@/lib/data";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Explore communities",
  description: "Discover Universes across music, art, fashion, gaming, film, design, culture and education.",
};

export default function ExplorePage() {
  const live = ROOMS.filter((r) => r.status === "live");
  return (
    <>
      <PageHero eyebrow="Explore" lines={["Discover", "communities."]} lede="Live rooms happening now, and Universes worth joining — sorted by what you care about." image={IMG.crowd} />

      <section className="shell section-tight" aria-labelledby="live-now">
        <div className="row-head">
          <h2 id="live-now" className="h3">
            <span className="live-dot live-dot-inline" aria-hidden /> Live now
          </h2>
          <span className="tiny faint">{live.length} rooms</span>
        </div>
        <div className="room-row" data-reveal-stagger data-lenis-prevent>
          {live.map((r) => (
            <RoomCard key={r.id} r={r} />
          ))}
        </div>
      </section>

      <section className="shell section-tight" aria-labelledby="cats">
        <div className="row-head">
          <h2 id="cats" className="h3">
            Categories
          </h2>
        </div>
        <div className="cat-grid" data-reveal-stagger="0.05">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/explore/${c.slug}`} className="cat-card" data-cursor="explore">
              <Photo src={c.image} alt="" sizes="(max-width: 700px) 50vw, 25vw" className="cat-photo" />
              <span className="cat-shade" />
              <span className="cat-body">
                <b>{c.name}</b>
                <small>{c.blurb}</small>
              </span>
              <ArrowUpRight size={16} className="cat-arrow" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section" aria-labelledby="all-universes">
        <h2 id="all-universes" className="h2" style={{ marginBottom: 32 }} data-reveal>
          Every Universe
        </h2>
        <UniverseDirectory showHeading={false} />
      </section>
    </>
  );
}
