"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { ChatPhone, LivePhone, MembershipPhone, StagePhone } from "@/components/cards/PhoneCards";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const PROMO = process.env.NEXT_PUBLIC_PROMO_VIDEO_URL;

const STEPS = [
  { title: "Set your rules", text: "Free for all, tickets, subscriptions, collectibles or custom rules. Every Universe decides who gets in.", Phone: MembershipPhone },
  { title: "Host rooms", text: "Go live right now, every week, or whenever inspiration hits. Rooms show up for members automatically.", Phone: LivePhone },
  { title: "Share the stage", text: "Invite guests in advance or bring someone from the audience up on the spot.", Phone: StagePhone },
  { title: "Keep it going", text: "The chat stays open before, during and after every live stream.", Phone: ChatPhone },
];
const STEP_MS = 4200;

/**
 * Hero video dialog. With NEXT_PUBLIC_PROMO_VIDEO_URL set it plays that licensed
 * clip with custom controls; otherwise it shows an interactive walkthrough that
 * is clearly labelled as such — never a fake "video".
 */
export function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={PROMO ? "Leam in 60 seconds" : "Product walkthrough"}
      headerExtra={!PROMO ? <DemoBadge label="Interactive walkthrough — not a video" /> : undefined}
    >
      {PROMO ? <PromoPlayer src={PROMO} /> : <Walkthrough />}
    </Modal>
  );
}

function PromoPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = ref.current!;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = ref.current!;
    if (v.paused) v.play().then(() => setPlaying(true));
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="promo">
      <video
        ref={ref}
        src={src}
        muted={muted}
        playsInline
        loop
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        onClick={toggle}
      />
      <div className="promo-controls">
        <button className="icon-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="promo-progress" aria-hidden>
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <button className="icon-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function Walkthrough() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!prefersReducedMotion());
  const [tick, setTick] = useState(0);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setI((n) => (n + 1) % STEPS.length);
      setTick((k) => k + 1);
    }, STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, i, tick]);

  useEffect(() => {
    if (prefersReducedMotion() || !stage.current) return;
    const { gsap } = ensureGsap();
    gsap.fromTo(stage.current.querySelector(".wt-phone"), { opacity: 0, y: 30, rotate: -2 }, { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: "expo.out" });
    gsap.fromTo(stage.current.querySelectorAll(".wt-copy > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.8, ease: "expo.out" });
  }, [i]);

  const go = (d: number) => {
    setI((n) => (n + d + STEPS.length) % STEPS.length);
    setTick((k) => k + 1);
  };
  const { Phone, title, text } = STEPS[i];

  return (
    <div className="walkthrough">
      <div className="wt-stage" ref={stage}>
        <div className="wt-copy">
          <span className="eyebrow">
            Step {i + 1} of {STEPS.length}
          </span>
          <h3 className="h2">{title}</h3>
          <p className="muted">{text}</p>
        </div>
        <div className="wt-phone" aria-hidden>
          <Phone interactive={false} />
        </div>
      </div>
      <div className="wt-controls">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous step">
          <ChevronLeft size={16} />
        </button>
        <button className="icon-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="icon-btn" onClick={() => go(1)} aria-label="Next step">
          <ChevronRight size={16} />
        </button>
        <div className="wt-progress" role="tablist" aria-label="Walkthrough steps">
          {STEPS.map((s, n) => (
            <button key={s.title} role="tab" aria-selected={n === i} aria-label={s.title} className={cn("wt-seg", n < i && "is-done")} onClick={() => (setI(n), setTick((k) => k + 1))}>
              <span key={`${tick}-${n}`} className={cn(n === i && playing && "is-running")} style={{ animationDuration: `${STEP_MS}ms` }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
