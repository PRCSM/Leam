import type { MetadataRoute } from "next";
import { CATEGORIES, CREATORS, POSTS, ROOMS, UNIVERSES } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ["", "/explore", "/creators", "/features", "/memberships", "/pricing", "/about", "/blog", "/contact", "/signup", "/privacy", "/terms", "/governance"];
  return [
    ...statics.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/explore/${c.slug}`, lastModified: now, priority: 0.6 })),
    ...CREATORS.map((c) => ({ url: `${SITE_URL}/creators/${c.slug}`, lastModified: now, priority: 0.6 })),
    ...UNIVERSES.map((u) => ({ url: `${SITE_URL}/universes/${u.slug}`, lastModified: now, priority: 0.7 })),
    ...ROOMS.map((r) => ({ url: `${SITE_URL}/rooms/${r.id}`, lastModified: now, priority: 0.4 })),
    ...POSTS.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.5 })),
  ];
}
