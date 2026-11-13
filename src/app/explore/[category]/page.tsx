import { use } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { CreatorCard, RoomCard } from "@/components/pages/Cards";
import { UniverseDirectory } from "@/components/home/Interactive";
import { CATEGORIES, CREATORS, ROOMS, UNIVERSES, getCategory } from "@/lib/data";

type Params = { category: string };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = getCategory((await params).category);
  return c ? { title: `${c.name} communities`, description: c.blurb } : {};
}

export default function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = use(params);
  const cat = getCategory(category);
  if (!cat) notFound();
  const creators = CREATORS.filter((c) => c.category === cat.slug);
  const unis = new Set(UNIVERSES.filter((u) => u.category === cat.slug).map((u) => u.slug));
  const rooms = ROOMS.filter((r) => unis.has(r.universe));

  return (
    <>
      <PageHero eyebrow={`Explore · ${cat.name}`} lines={[cat.name]} lede={cat.blurb} image={cat.image}>
        <Link href="/explore" className="btn btn-ghost btn-sm" data-reveal>
          <ArrowLeft size={14} /> All categories
        </Link>
      </PageHero>

      {!!creators.length && (
        <section className="shell section-tight" aria-labelledby="cat-creators">
          <div className="row-head">
            <h2 id="cat-creators" className="h3">
              Creators
            </h2>
          </div>
          <div className="creator-grid" data-reveal-stagger>
            {creators.map((c) => (
              <CreatorCard key={c.slug} c={c} />
            ))}
          </div>
        </section>
      )}

      {!!rooms.length && (
        <section className="shell section-tight" aria-labelledby="cat-rooms">
          <div className="row-head">
            <h2 id="cat-rooms" className="h3">
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

      <section className="shell section" aria-label={`${cat.name} Universes`}>
        <UniverseDirectory showHeading={false} initialCategory={cat.slug} />
      </section>
    </>
  );
}
