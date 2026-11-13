"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  headerExtra?: React.ReactNode;
  className?: string;
};

/**
 * Accessible dialog: portals to <body>, traps focus, closes on Esc/backdrop,
 * restores focus to the trigger, pauses smooth scrolling while open.
 */
export function Modal({ open, onClose, title, children, wide, headerExtra, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.documentElement.classList.add("lenis-stopped");
    window.dispatchEvent(new CustomEvent("leam:scroll-lock", { detail: true }));

    const { gsap } = ensureGsap();
    if (!prefersReducedMotion()) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "expo.out" });
    }

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
    requestAnimationFrame(() => (focusables()[1] ?? focusables()[0] ?? panelRef.current)?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
      window.dispatchEvent(new CustomEvent("leam:scroll-lock", { detail: false }));
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="modal-root" data-lenis-prevent>
      <div ref={backdropRef} className="modal-backdrop" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className={cn("modal", wide && "modal-wide", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-head">
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>
          <div className="modal-head-actions">
            {headerExtra}
            <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
