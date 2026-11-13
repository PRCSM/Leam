"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Declarative scroll motion. Pages stay server components and opt in with
 * data attributes; this director wires them to ScrollTrigger on every route:
 *
 *   data-reveal                fade + rise when entering the viewport
 *   data-reveal-stagger        stagger direct children
 *   data-split                 masked line-by-line headline reveal
 *   data-parallax="0.15"       vertical image drift (fraction of height)
 *   data-zoom                  image settles from 1.15 → 1 while scrolling past
 *   data-count="1240"          animated number (data-suffix / data-prefix)
 *   data-line                  hairline that draws from the left
 *
 * Elements are processed once, as they enter the DOM, and their tweens are
 * killed when they leave it.
 */
export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const reduced = prefersReducedMotion();
    const root = document.querySelector("main");
    if (!root) return;

    // Each processed element owns its tweens; when it leaves the DOM they're killed.
    const owned = new Map<Element, gsap.core.Animation[]>();
    const own = (el: Element, a: gsap.core.Animation) => owned.set(el, [...(owned.get(el) ?? []), a]);
    const fresh = (sel: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel)).filter((el) => {
        const key = `motion${sel.replace(/[^a-z]/gi, "")}`;
        if (el.dataset[key]) return false;
        el.dataset[key] = "1";
        return true;
      });

    const scan = () => {
      for (const [el, anims] of owned) {
        if (!el.isConnected) {
          anims.forEach((a) => a.kill());
          owned.delete(el);
        }
      }

      if (reduced) {
        gsap.set(fresh("[data-reveal]"), { autoAlpha: 1 });
        fresh("[data-reveal-stagger]").forEach((el) => gsap.set(el.children, { autoAlpha: 1 }));
        fresh("[data-split]").forEach((el) => gsap.set(el.querySelectorAll(".mask > span"), { y: 0, yPercent: 0 }));
        gsap.set(fresh("[data-line]"), { scaleX: 1 });
        fresh("[data-count]").forEach((el) => {
          el.textContent = `${el.dataset.prefix ?? ""}${Number(el.dataset.count).toLocaleString()}${el.dataset.suffix ?? ""}`;
        });
        return;
      }

      fresh("[data-reveal]").forEach((el) => {
        own(el, gsap.fromTo(el, { autoAlpha: 0, y: Number(el.dataset.reveal) || 36 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
      });

      fresh("[data-reveal-stagger]").forEach((el) => {
        own(
          el,
          gsap.fromTo(el.children, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.05, ease: "expo.out", stagger: Number(el.dataset.revealStagger) || 0.08, scrollTrigger: { trigger: el, start: "top 86%", once: true } })
        );
      });

      fresh("[data-split]").forEach((el) => {
        own(
          el,
          gsap.fromTo(el.querySelectorAll(".mask > span"), { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.25, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 85%", once: true } })
        );
      });

      fresh("[data-line]").forEach((el) => {
        own(el, gsap.fromTo(el, { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 92%", once: true } }));
      });

      fresh("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax) || 0.12;
        own(el, gsap.fromTo(el, { yPercent: -amt * 100 }, { yPercent: amt * 100, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
      });

      fresh("[data-zoom]").forEach((el) => {
        own(el, gsap.fromTo(el, { scale: 1.16 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "center center", scrub: true } }));
      });

      fresh("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const obj = { v: 0 };
        own(
          el,
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${el.dataset.prefix ?? ""}${obj.v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${el.dataset.suffix ?? ""}`;
            },
          })
        );
      });
      ScrollTrigger.refresh();
    };

    // Route content can stream in after the pathname changes (loading.tsx,
    // Suspense), so new elements are picked up as they're inserted.
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    };
    schedule();
    const mo = new MutationObserver(schedule);
    mo.observe(root, { childList: true, subtree: true });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      owned.forEach((anims) => anims.forEach((a) => a.kill()));
    };
  }, []);

  // Layout shifts on navigation: recompute trigger positions.
  useEffect(() => {
    const id = window.setTimeout(() => ensureGsap().ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
