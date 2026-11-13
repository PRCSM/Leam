import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { IMG } from "@/lib/images";

export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf-media" aria-hidden>
        <Photo src={IMG.caveTorch} alt="" sizes="100vw" position="50% 40%" />
        <div className="nf-shade" />
      </div>
      <div className="shell nf-inner">
        <span className="eyebrow">404 · Lost in the rabbit hole</span>
        <h1 className="display">
          This Universe
          <br />
          doesn&apos;t exist<Sparkle size={40} className="inline-sparkle" />
        </h1>
        <p className="lede muted">The page may have moved, or the room may have ended. Let&apos;s get you somewhere with people in it.</p>
        <div className="final-actions">
          <Link href="/" className="btn btn-light btn-lg">
            Back home
          </Link>
          <Link href="/explore" className="btn btn-ghost btn-lg">
            Explore Communities
          </Link>
        </div>
      </div>
    </section>
  );
}
