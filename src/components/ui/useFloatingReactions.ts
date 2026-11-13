"use client";

import { useCallback, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/* ---------------------------------------------------------------------- */
/*  Floating reaction bubbles shared by the live cards                     */
/* ---------------------------------------------------------------------- */
export function useFloatingReactions() {
  const layer = useRef<HTMLDivElement>(null);
  const burst = useCallback((emoji: React.ReactNode = "♥") => {
    const host = layer.current;
    if (!host) return;
    const el = document.createElement("span");
    el.className = "float-reaction";
    el.textContent = typeof emoji === "string" ? emoji : "♥";
    host.appendChild(el);
    if (prefersReducedMotion()) {
      setTimeout(() => el.remove(), 600);
      return;
    }
    const { gsap } = ensureGsap();
    gsap.fromTo(
      el,
      { y: 0, x: 0, scale: 0.4, opacity: 0 },
      {
        keyframes: [
          { scale: 1.15, opacity: 1, duration: 0.25, ease: "back.out(3)" },
          { y: -140 - Math.random() * 60, x: (Math.random() - 0.5) * 60, opacity: 0, scale: 0.9, duration: 1.4, ease: "power1.out" },
        ],
        onComplete: () => el.remove(),
      }
    );
  }, []);
  return { layer, burst };
}

