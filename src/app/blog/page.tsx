import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { Photo } from "@/components/ui/Photo";
import { POSTS } from "@/lib/data";

export const metadata: Metadata = { title: "Journal", description: "Guides and stories about building communities, hosting live rooms and earning from memberships." };

const fmt = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogPage() {
  const [lead, ...rest] = POSTS;
  return (
    <>
      <PageHero eyebrow="Journal" lines={["Notes from", "the rabbit hole."]} lede="Guides on hosting, pricing and community — written for creators." compact />
      <section className="shell section-tight">
        <Link href={`/blog/${lead.slug}`} className="post-lead" data-cursor="view" data-reveal>
          <span className="post-lead-media">
            <Photo src={lead.image} alt="" sizes="(max-width: 900px) 100vw, 60vw" />
          </span>
          <span className="post-lead-body">
            <span className="chip">{lead.tag}</span>
            <b className="h2">{lead.title}</b>
            <span className="muted">{lead.excerpt}</span>
            <span className="tiny faint">
              {fmt(lead.date)} · {lead.readMins} min read
            </span>
          </span>
        </Link>
        <div className="post-grid" data-reveal-stagger>
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="post-card" data-cursor="view">
              <span className="post-card-media">
                <Photo src={p.image} alt="" sizes="(max-width: 900px) 90vw, 33vw" />
              </span>
              <span className="chip">{p.tag}</span>
              <b>{p.title}</b>
              <span className="small muted">{p.excerpt}</span>
              <span className="tiny faint">
                {fmt(p.date)} · {p.readMins} min
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
