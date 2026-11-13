"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Scroll to an element or y-position through Lenis when active, natively otherwise. */
export function scrollToTarget(target: string | number | HTMLElement, offset = -80) {
  if (lenisInstance) lenisInstance.scrollTo(target, { offset, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/**
 * Lenis smooth scrolling for fine pointers, synced to GSAP's ticker so
 * ScrollTrigger reads the same scroll position Lenis renders. Touch devices
 * and reduced-motion users keep native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, autoRaf: false });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onLock = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start());
    window.addEventListener("leam:scroll-lock", onLock);

    // Same-page anchor links glide through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("leam:scroll-lock", onLock);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Reset to top on route change.
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return <CustomScrollbar />;
}

/** Slim progress-style scrollbar with a draggable thumb (desktop only). */
function CustomScrollbar() {
  const barRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current!;
    const track = trackRef.current!;
    const thumb = thumbRef.current!;
    let hideTimer = 0;
    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    const metrics = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const trackH = track.clientHeight;
      const thumbH = Math.max(40, (window.innerHeight / doc.scrollHeight) * trackH);
      return { max, trackH, thumbH };
    };

    const render = () => {
      const { max, trackH, thumbH } = metrics();
      const y = (window.scrollY / max) * (trackH - thumbH);
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
      bar.style.display = document.documentElement.scrollHeight <= window.innerHeight + 2 ? "none" : "";
      bar.setAttribute("aria-valuenow", String(Math.round((window.scrollY / max) * 100)));
    };

    const flash = () => {
      bar.classList.add("is-visible");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => !dragging && bar.classList.remove("is-visible"), 1200);
    };

    const onScroll = () => {
      render();
      flash();
    };

    const scrollTo = (y: number) => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragStartY = e.clientY;
      dragStartScroll = window.scrollY;
      bar.classList.add("is-dragging");
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const { max, trackH, thumbH } = metrics();
      const ratio = max / (trackH - thumbH);
      scrollTo(dragStartScroll + (e.clientY - dragStartY) * ratio);
    };
    const onUp = () => {
      dragging = false;
      bar.classList.remove("is-dragging");
      flash();
    };
    const onTrack = (e: MouseEvent) => {
      if (e.target === thumb) return;
      const rect = track.getBoundingClientRect();
      const { max } = metrics();
      const lenis = getLenis();
      const y = ((e.clientY - rect.top) / rect.height) * max;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: "smooth" });
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", render);
    const ro = new ResizeObserver(render);
    ro.observe(document.body);
    thumb.addEventListener("pointerdown", onDown);
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
    track.addEventListener("click", onTrack);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", render);
      ro.disconnect();
      thumb.removeEventListener("pointerdown", onDown);
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
      track.removeEventListener("click", onTrack);
    };
  }, []);

  // Decorative for pointer users; keyboard and assistive tech use native scrolling.
  return (
    <div ref={barRef} className="scrollbar" aria-hidden="true">
      <div ref={trackRef} className="scrollbar-track">
        <div ref={thumbRef} className="scrollbar-thumb" />
      </div>
    </div>
  );
}
