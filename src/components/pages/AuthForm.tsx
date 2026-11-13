"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { useDemoSession } from "@/lib/demo-store";
import { Field } from "./ContactForm";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

/**
 * Sign-in / sign-up UI. No auth provider is configured in this build, so a
 * successful submit stores a DEMO session in localStorage and opens the
 * dashboard. Swap `startSession` for your provider (Auth.js, Clerk, Supabase…)
 * and protect /dashboard in middleware once it exists.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [, setSession] = useDemoSession();
  const [errors, setErrors] = useState<Errors>({});
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<"creator" | "fan">("creator");

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>;
    const e: Errors = {};
    if (mode === "signup" && (d.name ?? "").trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL.test((d.email ?? "").trim())) e.email = "Enter a valid email address.";
    if ((d.password ?? "").length < 8) e.password = "Use at least 8 characters.";
    if (mode === "signup" && !d.terms) e.terms = "Please accept the terms to continue.";
    setErrors(e);
    if (Object.keys(e).length) {
      ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    const email = d.email.trim();
    setSession({ name: (d.name || email.split("@")[0]).trim(), email, role: mode === "signup" ? role : "creator" });
    router.push("/dashboard");
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <DemoBadge label="Demo sign-in — no account is created" />
      {mode === "signup" && (
        <div className="auth-role" role="radiogroup" aria-label="I'm joining as">
          {(["creator", "fan"] as const).map((r) => (
            <button key={r} type="button" role="radio" aria-checked={role === r} className={`chip${role === r ? " is-active" : ""}`} onClick={() => setRole(r)}>
              {r === "creator" ? "I'm a creator" : "I'm a fan"}
            </button>
          ))}
        </div>
      )}
      {mode === "signup" && <Field label="Name" name="name" error={errors.name} autoComplete="name" />}
      <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="pw-wrap">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            className="input"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-err" : undefined}
          />
          <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <span id="password-err" className="field-error">
            {errors.password}
          </span>
        )}
      </div>
      {mode === "signup" && (
        <div className="field">
          <label className="check">
            <input type="checkbox" name="terms" aria-invalid={!!errors.terms} />
            <span>
              I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <span className="field-error">{errors.terms}</span>}
        </div>
      )}
      <button className="btn btn-light btn-lg" type="submit">
        {mode === "login" ? "Log in" : "Create account"}
      </button>
      <p className="small muted">
        {mode === "login" ? (
          <>
            New here? <Link href="/signup" className="link-underline" style={{ backgroundSize: "100% 1px" }}>Create an account</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/login" className="link-underline" style={{ backgroundSize: "100% 1px" }}>Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
