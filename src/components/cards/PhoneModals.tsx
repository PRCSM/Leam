"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Lock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Photo, Avatar } from "@/components/ui/Photo";
import { LiveRoom } from "@/components/room/LiveRoom";
import { PEOPLE, getCreator, type Person, type Universe } from "@/lib/data";
import { useDemoState } from "@/lib/demo-store";
import { cn, formatCount, formatPrice } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Membership preview — explicitly a simulation, never a checkout.    */
/* ------------------------------------------------------------------ */
export function MembershipModal({ open, onClose, universe }: { open: boolean; onClose: () => void; universe: Universe }) {
  const creator = getCreator(universe.creator)!;
  const [tierId, setTierId] = useState(universe.tiers[1]?.id ?? universe.tiers[0].id);
  const [step, setStep] = useState<"choose" | "confirm">("choose");
  const [joined, setJoined] = useDemoState<string[]>("joined", []);
  const isMember = joined.includes(universe.slug);
  const tier = universe.tiers.find((t) => t.id === tierId)!;

  const close = () => {
    setStep("choose");
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title={`Join ${universe.title}`} headerExtra={<DemoBadge />}>
      <div className="mm">
        <div className="mm-hero">
          <Photo src={universe.cover} alt="" sizes="520px" />
          <div className="mm-hero-text">
            <span className="eyebrow">{universe.tagline}</span>
            <strong>{universe.title}</strong>
            <span className="small muted">
              Hosted by {creator.name} · {formatCount(universe.members)} members · {universe.schedule}
            </span>
          </div>
        </div>

        {isMember ? (
          <div className="mm-member" role="status">
            <Check size={18} />
            <div>
              <strong>You&apos;re in (demo membership).</strong>
              <p className="small muted">Saved in this browser only. No payment was taken and no account was created.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setJoined((j) => j.filter((s) => s !== universe.slug))}>
              Leave
            </button>
          </div>
        ) : step === "choose" ? (
          <>
            <fieldset className="mm-tiers">
              <legend className="small muted">Choose access</legend>
              {universe.tiers.map((t) => (
                <label key={t.id} className={cn("mm-tier", t.id === tierId && "is-selected")}>
                  <input type="radio" name="tier" value={t.id} checked={t.id === tierId} onChange={() => setTierId(t.id)} />
                  <span className="mm-tier-head">
                    <strong>{t.name}</strong>
                    <span>
                      {formatPrice(t.priceCents)}
                      {t.priceCents > 0 && <small>{t.interval === "month" ? " / month" : " once"}</small>}
                    </span>
                  </span>
                  <ul>
                    {t.perks.map((p) => (
                      <li key={p}>
                        <Check size={12} /> {p}
                      </li>
                    ))}
                  </ul>
                </label>
              ))}
            </fieldset>
            <button className="btn btn-light btn-lg mm-go" onClick={() => (tier.priceCents === 0 ? setJoined((j) => [...j, universe.slug]) : setStep("confirm"))}>
              {tier.priceCents === 0 ? "Follow for free" : `Continue · ${formatPrice(tier.priceCents)}`}
            </button>
          </>
        ) : (
          <div className="mm-confirm">
            <Lock size={18} />
            <p>
              <strong>Checkout isn&apos;t connected in this demo.</strong> In production this step hands off to a hosted payment page (e.g.
              Stripe Checkout) and membership starts only after the provider confirms payment.
            </p>
            <div className="mm-confirm-actions">
              <button className="btn btn-ghost" onClick={() => setStep("choose")}>
                Back
              </button>
              <button
                className="btn btn-light"
                onClick={() => {
                  setJoined((j) => [...j, universe.slug]);
                  setStep("choose");
                }}
              >
                Simulate membership
              </button>
            </div>
          </div>
        )}
        <Link href={`/universes/${universe.slug}`} className="mm-link link-underline" onClick={close}>
          View the Universe <ArrowUpRight size={14} />
        </Link>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Live room preview                                                  */
/* ------------------------------------------------------------------ */
export function RoomPreviewModal({ open, onClose, roomId }: { open: boolean; onClose: () => void; roomId: string }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title="Live room preview"
      headerExtra={
        <>
          <DemoBadge label="Simulated stream" />
          <Link href={`/rooms/${roomId}`} className="btn btn-light btn-sm" onClick={onClose}>
            Open room <ArrowUpRight size={14} />
          </Link>
        </>
      }
    >
      <LiveRoom roomId={roomId} compact />
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Participants + member profile detail                               */
/* ------------------------------------------------------------------ */
const BIOS: Record<string, string> = {
  Host: "Runs the room, sets the topic and decides who comes on stage.",
  "Co-host": "Keeps the chat moving and brings questions to the stage.",
  Speaker: "Invited up from the audience for this episode.",
  Listener: "Member since 2024. Usually first in the chat.",
};

export function ParticipantsModal({
  open,
  onClose,
  focus,
  onFocus,
}: {
  open: boolean;
  onClose: () => void;
  focus: Person | null;
  onFocus: (p: Person | null) => void;
}) {
  const [following, setFollowing] = useDemoState<string[]>("following", []);
  const groups = ["Host", "Co-host", "Speaker", "Listener"] as const;

  return (
    <Modal open={open} onClose={onClose} title={focus ? focus.name : "In the room · 72"} headerExtra={<DemoBadge />}>
      {focus ? (
        <div className="profile-detail">
          <button className="btn btn-ghost btn-sm" onClick={() => onFocus(null)}>
            <ArrowLeft size={14} /> Everyone
          </button>
          <Photo src={focus.image} alt={`${focus.name}'s profile photo`} sizes="480px" className="profile-photo" />
          <div className="profile-row">
            <div>
              <h3 className="h3">{focus.name}</h3>
              <span className="chip">{focus.role}</span>
            </div>
            <button
              className={cn("btn", following.includes(focus.id) ? "btn-ghost" : "btn-light")}
              aria-pressed={following.includes(focus.id)}
              onClick={() => setFollowing((f) => (f.includes(focus.id) ? f.filter((x) => x !== focus.id) : [...f, focus.id]))}
            >
              {following.includes(focus.id) ? "Following" : "Follow"}
            </button>
          </div>
          <p className="muted">{BIOS[focus.role]}</p>
        </div>
      ) : (
        <div className="people-list">
          {groups.map((g) => {
            const list = PEOPLE.filter((p) => p.role === g);
            if (!list.length) return null;
            return (
              <section key={g}>
                <h3 className="tiny faint people-group">{g === "Listener" ? "Listeners · 64 more" : `${g}s`.replace("Co-hosts", "Co-host")}</h3>
                <ul>
                  {list.map((p) => (
                    <li key={p.id}>
                      <button className="person-row" onClick={() => onFocus(p)}>
                        <Avatar src={p.image} alt="" size={40} />
                        <span>
                          <strong>{p.name}</strong>
                          <small className="muted">{p.role}</small>
                        </span>
                        <ArrowUpRight size={14} className="faint" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
