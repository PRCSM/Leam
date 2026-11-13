"use client";

import { useState } from "react";
import { Check, Plus, Share2 } from "lucide-react";
import { MembershipModal } from "@/components/cards/PhoneModals";
import { useDemoState } from "@/lib/demo-store";
import { getUniverse } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";

export function FollowButton({ id, name }: { id: string; name: string }) {
  const [following, setFollowing] = useDemoState<string[]>("following", []);
  const on = following.includes(id);
  return (
    <button
      className={cn("btn", on ? "btn-ghost" : "btn-light")}
      aria-pressed={on}
      onClick={() => setFollowing((f) => (on ? f.filter((x) => x !== id) : [...f, id]))}
      aria-label={on ? `Unfollow ${name}` : `Follow ${name}`}
    >
      {on ? <Check size={15} /> : <Plus size={15} />} {on ? "Following" : "Follow"}
    </button>
  );
}

export function JoinButton({ slug, label, className }: { slug: string; label?: string; className?: string }) {
  const universe = getUniverse(slug)!;
  const [open, setOpen] = useState(false);
  const [joined] = useDemoState<string[]>("joined", []);
  const member = joined.includes(slug);
  const from = universe.tiers.find((t) => t.priceCents > 0);
  return (
    <>
      <button className={cn("btn", member ? "btn-ghost" : "btn-light", className)} onClick={() => setOpen(true)} data-cursor="join">
        {member ? (
          <>
            <Check size={15} /> Member (demo)
          </>
        ) : (
          label ?? `Join · from ${from ? formatPrice(from.priceCents) : "Free"}`
        )}
      </button>
      <MembershipModal open={open} onClose={() => setOpen(false)} universe={universe} />
    </>
  );
}

export function ShareButton({ path, label = "Share" }: { path: string; label?: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) await navigator.share({ url });
      else await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* user cancelled */
    }
  };
  return (
    <button className="btn btn-ghost" onClick={share}>
      <Share2 size={15} /> {done ? "Link copied" : label}
    </button>
  );
}
