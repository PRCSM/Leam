import { use } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { SplitLines } from "@/components/motion/SplitLines";
import { POSTS, getPost } from "@/lib/data";

type Params = { slug: string };
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: { type: "article", publishedTime: p.date, images: [p.image] } } : {};
}

export default function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const post = getPost(slug);
  if (!post) notFound();
  const next = POSTS[(POSTS.indexOf(post) + 1) % POSTS.length];
  return (
    <article className="post">
      <header className="shell post-head">
        <Link href="/blog" className="btn btn-ghost btn-sm" data-reveal="12">
          <ArrowLeft size={14} /> Journal
        </Link>
        <span className="eyebrow" data-reveal>
          {post.tag} · {post.readMins} min read · {new Date(post.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </span>
        <SplitLines as="h1" className="h1" lines={[post.title]} />
        <p className="lede muted" data-reveal>
          {post.excerpt}
        </p>
      </header>
      <div className="shell-wide post-cover" data-reveal>
        <div className="post-cover-inner" data-parallax="0.06">
          <Photo src={post.image} alt="" sizes="100vw" priority />
        </div>
      </div>
      <div className="shell prose post-body">
        {post.body.map((p, i) => (
          <p key={i} data-reveal>
            {p}
          </p>
        ))}
      </div>
      <div className="shell post-next">
        <span className="tiny faint">Next</span>
        <Link href={`/blog/${next.slug}`} className="h2 link-underline">
          {next.title}
        </Link>
      </div>
    </article>
  );
}
