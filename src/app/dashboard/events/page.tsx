"use client";

import { useState } from "react";
import Link from "next/link";
import { Radio, Trash2 } from "lucide-react";
import { DashHead } from "@/components/dashboard/DashboardShell";
import { useDashEvents, useDashUniverses, type DashEvent } from "@/components/dashboard/store";
import { formatPrice } from "@/lib/utils";

export default function EventsPage() {
  const [events, setEvents] = useDashEvents();
  const [unis] = useDashUniverses();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [kind, setKind] = useState<DashEvent["kind"]>("room");
  const sorted = [...events].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const today = new Date().toISOString().slice(0, 10);

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const e: Record<string, string> = {};
    if (d.title.trim().length < 3) e.title = "Give it a title (3+ characters).";
    if (!d.date || d.date < today) e.date = "Pick today or a future date.";
    if (!d.time) e.time = "Pick a start time.";
    if (kind !== "room" && !(Number(d.price) > 0)) e.price = "Set a ticket price above $0.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setEvents((list) => [
      ...list,
      { id: `e-${Date.now()}`, title: d.title.trim(), universe: d.universe, date: d.date, time: d.time, kind, priceCents: kind === "room" ? 0 : Math.round(Number(d.price) * 100), capacity: Number(d.capacity) || 0 },
    ]);
    form.reset();
    setKind("room");
  };

  return (
    <>
      <DashHead title="Events" sub="Schedule rooms, ticketed events and premium sessions." />
      <div className="dash-cols dash-cols-wide">
        <form className="panel dash-panel form-stack" onSubmit={submit} noValidate>
          <b>New event</b>
          <div className="field">
            <label htmlFor="ev-title">Title</label>
            <input id="ev-title" name="title" className="input" aria-invalid={!!errors.title} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>
          <div className="field">
            <label htmlFor="ev-uni">Universe</label>
            <select id="ev-uni" name="universe" className="select">
              {unis.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="ev-date">Date</label>
              <input id="ev-date" name="date" type="date" min={today} className="input" aria-invalid={!!errors.date} />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
            <div className="field">
              <label htmlFor="ev-time">Time</label>
              <input id="ev-time" name="time" type="time" className="input" aria-invalid={!!errors.time} />
              {errors.time && <span className="field-error">{errors.time}</span>}
            </div>
          </div>
          <div className="field">
            <span className="small muted">Type</span>
            <div className="dir-cats" role="radiogroup" aria-label="Event type">
              {(["room", "ticketed", "premium"] as const).map((k) => (
                <button key={k} type="button" role="radio" aria-checked={kind === k} className={`chip${kind === k ? " is-active" : ""}`} onClick={() => setKind(k)}>
                  {k === "room" ? "Members room" : k === "ticketed" ? "Ticketed" : "Premium (limited seats)"}
                </button>
              ))}
            </div>
          </div>
          {kind !== "room" && (
            <div className="form-row">
              <div className="field">
                <label htmlFor="ev-price">Ticket price (USD)</label>
                <input id="ev-price" name="price" type="number" min="1" step="0.5" className="input" aria-invalid={!!errors.price} />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>
              <div className="field">
                <label htmlFor="ev-cap">Capacity</label>
                <input id="ev-cap" name="capacity" type="number" min="0" className="input" placeholder="Unlimited" />
              </div>
            </div>
          )}
          <button className="btn btn-light" type="submit">
            Schedule
          </button>
        </form>
        <div className="panel dash-panel">
          <div className="panel-head">
            <b>Scheduled · {sorted.length}</b>
          </div>
          <ul className="event-list">
            {sorted.map((e) => (
              <li key={e.id}>
                <span className="event-date">
                  <b>{new Date(e.date + "T12:00:00").getDate()}</b>
                  <small>{new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}</small>
                </span>
                <span>
                  <b>{e.title}</b>
                  <small className="faint">
                    {e.time} · {e.kind === "room" ? "Members" : `${e.kind} · ${formatPrice(e.priceCents)}`}
                    {e.capacity ? ` · ${e.capacity} seats` : ""}
                  </small>
                </span>
                <span className="event-actions">
                  <Link href="/rooms/bts-monday" className="icon-btn" aria-label={`Open room preview for ${e.title}`}>
                    <Radio size={14} />
                  </Link>
                  <button className="icon-btn" aria-label={`Cancel ${e.title}`} onClick={() => setEvents((l) => l.filter((x) => x.id !== e.id))}>
                    <Trash2 size={14} />
                  </button>
                </span>
              </li>
            ))}
            {!sorted.length && <li className="muted small">Nothing scheduled.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
