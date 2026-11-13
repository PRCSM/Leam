"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="nf">
      <div className="shell nf-inner">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="h1">The room dropped.</h1>
        <p className="lede muted">An unexpected error interrupted this page. Try again — if it keeps happening, let support know.</p>
        <div className="final-actions">
          <button className="btn btn-light btn-lg" onClick={reset}>
            Try again
          </button>
          <Link href="/contact" className="btn btn-ghost btn-lg">
            Contact support
          </Link>
        </div>
        {error.digest && <p className="tiny faint">Reference: {error.digest}</p>}
      </div>
    </section>
  );
}
