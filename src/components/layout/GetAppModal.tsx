"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { useDemoState } from "@/lib/demo-store";

/** The mobile apps aren't public yet, so the honest version of "Get the app" is a waitlist. */
export function GetAppModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useDemoState<string | null>("app-waitlist", null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSaved(email.trim());
  };

  return (
    <Modal open={open} onClose={onClose} title="Leam for iOS & Android" headerExtra={<DemoBadge />}>
      <div className="getapp">
        <div className="getapp-icon">
          <Smartphone size={22} />
        </div>
        <p className="muted">
          The mobile apps are in private beta. Leave your email and we&apos;ll send a download link when your region opens. Everything
          you see on this site also works in the mobile browser.
        </p>
        {saved ? (
          <p className="notice" role="status">
            You&apos;re on the list as <strong>{saved}</strong>. (Demo: stored only in this browser — no email is sent.)
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="getapp-form">
            <div className="field">
              <label htmlFor="app-email">Email</label>
              <input
                id="app-email"
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "app-email-error" : undefined}
                placeholder="you@studio.com"
              />
              {error && (
                <span id="app-email-error" className="field-error">
                  {error}
                </span>
              )}
            </div>
            <button className="btn btn-light" type="submit">
              Join the beta list
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
