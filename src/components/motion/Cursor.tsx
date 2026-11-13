"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Minimal desktop cursor. Elements opt in to a label with
 * data-cursor="view|join|watch|drag|explore". Disabled on touch and for
 * reduced-motion users; keyboard focus styles are untouched.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const el = ref.current!;
    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const text = labelled?.dataset.cursor ?? "";
      setLabel((prev) => (prev === text ? prev : text));
      el.classList.toggle("is-labelled", !!text);
      el.classList.toggle("is-link", !text && !!t.closest("a,button,[role=button],label,select"));
      el.classList.toggle("is-hidden", !!t.closest("input,textarea,iframe,[data-native-cursor]"));
    };
    const onLeave = () => el.classList.add("is-hidden");
    const onEnter = () => el.classList.remove("is-hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  useEffect(() => {
    ref.current?.classList.remove("is-labelled", "is-link");
    setLabel("");
  }, [pathname]);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-label">{label.toUpperCase()}</span>
    </div>
  );
}
