"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Errors = Partial<Record<"name" | "email" | "topic" | "message" | "form", string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const validate = (d: Record<string, string>): Errors => {
    const e: Errors = {};
    if (d.name.trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL.test(d.email.trim())) e.email = "Please enter a valid email.";
    if (!d.topic) e.topic = "Choose a topic.";
    if (d.message.trim().length < 20) e.message = "Tell us a little more (at least 20 characters).";
    return e;
  };

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>;
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status === 422) {
        setErrors((await res.json()).errors ?? {});
        setState("idle");
        return;
      }
      if (!res.ok) throw new Error();
      setState("sent");
    } catch {
      setErrors({ form: "We couldn't reach the server. Please try again in a moment." });
      setState("idle");
    }
  };

  if (state === "sent")
    return (
      <div className="notice form-done" role="status">
        <b>Thanks — your message passed validation.</b>
        <p>In this build no email provider is connected, so nothing was delivered yet. Once one is configured, messages go straight to the support inbox.</p>
      </div>
    );

  return (
    <form className="form-grid" onSubmit={submit} noValidate data-reveal>
      <Field label="Name" name="name" error={errors.name} autoComplete="name" />
      <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
      <div className="field">
        <label htmlFor="topic">Topic</label>
        <select id="topic" name="topic" className="select" defaultValue="" aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-err" : undefined}>
          <option value="" disabled>
            Choose one
          </option>
          <option value="creator">I&apos;m a creator</option>
          <option value="support">Account or billing support</option>
          <option value="press">Press</option>
          <option value="other">Something else</option>
        </select>
        {errors.topic && (
          <span id="topic-err" className="field-error">
            {errors.topic}
          </span>
        )}
      </div>
      <div className="field field-full">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" className="textarea" rows={6} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        {errors.message && (
          <span id="message-err" className="field-error">
            {errors.message}
          </span>
        )}
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden />
      {errors.form && <p className="field-error field-full">{errors.form}</p>}
      <button className="btn btn-light btn-lg" type="submit" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 size={16} className="spin" /> : null} Send message
      </button>
    </form>
  );
}

export function Field({ label, name, type = "text", error, autoComplete, defaultValue }: { label: string; name: string; type?: string; error?: string; autoComplete?: string; defaultValue?: string }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="input" autoComplete={autoComplete} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} />
      {error && (
        <span id={`${name}-err`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
