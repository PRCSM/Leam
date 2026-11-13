"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Sparkle, InfinityMark } from "@/components/ui/Sparkle";
import { VideoModal } from "./VideoModal";
import { IMG } from "@/lib/images";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const el = root.current!;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-intro]"), { clearProps: "all" });
      return;
    }
    const nav = document.querySelector(".site-header");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero-curtain", { opacity: 1 }, { opacity: 0, duration: 1.4, ease: "power2.inOut" }, 0)
        .fromTo(".hero-photo img", { scale: 1.08 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
        .fromTo(nav, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 1 }, 0.5)
        .fromTo(".hero-eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 0.7)
        .fromTo(".hero-title .mask > span", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.4 }, 0.8)
        .fromTo(".hero-title .sparkle", { scale: 0, rotate: -90, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.2, ease: "back.out(2.2)" }, 1.35)
        .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 1.05)
        .fromTo(".hero-desc", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2 }, 1.4)
        .fromTo(".hero-video", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.8)" }, 1.6);

      // Gentle idle twinkle on the sparkle.
      gsap.to(".hero-title .sparkle", { rotate: 12, scale: 1.08, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.6 });

      // Scroll: photo drifts and dims as the hero leaves.
      gsap.to(".hero-photo", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-content", {
        y: -40,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "35% top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => {
      ctx.revert();
      if (nav) gsap.set(nav, { clearProps: "opacity,transform" });
    };
  }, []);

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden>
        <Photo src={IMG.heroDancer} alt="" priority sizes="100vw" className="hero-photo" position="62% 28%" />
        <div className="hero-glow" />
        <div className="hero-fade" />
        <div className="hero-curtain" />
      </div>

      <div className="shell hero-content">
        <p className="eyebrow hero-eyebrow" data-intro>
          Governance
        </p>
        <div className="hero-titlebar">
          <h1 id="hero-title" className="hero-title" data-intro>
            <span className="mask">
              <span>
                Create your{" "}
                <span className="hero-last">
                  Universe
                  <Sparkle className="hero-sparkle" size={30} />
                </span>
              </span>
            </span>
          </h1>
          <button className="hero-video" onClick={() => setVideoOpen(true)} aria-label="Watch the Leam preview" data-cursor="watch" data-intro>
            <Video size={18} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
        <hr className="hero-rule" data-intro />
        <p className="hero-desc" data-intro>
          A Universe is a series of live rooms and a community chat safeguarded with anything you&apos;d like: tickets, subscriptions,
          NFTs, merch or literally anything else <InfinityMark className="hero-inf" />
        </p>
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
