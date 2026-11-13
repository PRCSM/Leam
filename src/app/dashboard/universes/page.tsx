"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, Trash2, Upload } from "lucide-react";
import { DashHead } from "@/components/dashboard/DashboardShell";
import { COVER_CHOICES, useDashUniverses, type DashUniverse } from "@/components/dashboard/store";
import { Photo } from "@/components/ui/Photo";
import { ACCESS_MODES, CATEGORIES, UNIVERSES } from "@/lib/data";
import { cn, formatCount } from "@/lib/utils";

const blank = (): DashUniverse => ({
  id: `u-${Date.now()}`,
  title: "",
  tagline: "",
  category: "culture",
  access: "subscription",
  schedule: "Weekly",
  cover: COVER_CHOICES[0],
  members: 0,
  tiers: [
    { id: "free", name: "Follower", priceCents: 0, interval: "month", perks: ["Public rooms"] },
    { id: "member", name: "Member", priceCents: 800, interval: "month", perks: ["Every room", "Full chat"] },
  ],
  published: false,
  slowMode: false,
  keywordFilter: "",
});

export default function UniversesDash() {
  const [unis, setUnis] = useDashUniverses();
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<DashUniverse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!selected && unis.length) setSelected(unis[0].id);
  }, [unis, selected]);
  useEffect(() => {
    const u = unis.find((x) => x.id === selected);
    if (u) setDraft(structuredClone(u));
    setErrors({});
    setConfirmDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const isNew = draft && !unis.some((u) => u.id === draft.id);
  const set = <K extends keyof DashUniverse>(k: K, v: DashUniverse[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const errs: Record<string, string> = {};
    if (draft.title.trim().length < 3) errs.title = "Name needs at least 3 characters.";
    if (draft.tiers.some((t) => !t.name.trim())) errs.tiers = "Every tier needs a name.";
    if (draft.tiers.some((t) => t.priceCents < 0 || t.priceCents > 100000)) errs.tiers = "Prices must be between $0 and $1,000.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Uploaded covers are object URLs (this session only) — don't persist them.
    const toStore = { ...draft, title: draft.title.trim(), cover: draft.cover.startsWith("blob:") ? COVER_CHOICES[0] : draft.cover };
    setUnis((list) => (list.some((u) => u.id === draft.id) ? list.map((u) => (u.id === draft.id ? toStore : u)) : [...list, toStore]));
    setSelected(draft.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors((e) => ({ ...e, cover: "Choose an image file." }));
    if (file.size > 8 * 1024 * 1024) return setErrors((e) => ({ ...e, cover: "Images must be under 8 MB." }));
    setErrors(({ cover, ...rest }) => rest);
    set("cover", URL.createObjectURL(file));
  };

  return (
    <>
      <DashHead
        title="Universes"
        sub="Create and configure your communities."
        action={
          <button
            className="btn btn-light btn-sm"
            onClick={() => {
              setSelected(null);
              setDraft(blank());
              setErrors({});
            }}
          >
            <Plus size={14} /> New Universe
          </button>
        }
      />
      <div className="uni-dash">
        <ul className="uni-dash-list">
          {unis.map((u) => (
            <li key={u.id}>
              <button className={cn("uni-dash-item", draft?.id === u.id && "is-active")} onClick={() => setSelected(u.id)}>
                <Photo src={u.cover} alt="" sizes="60px" className="uni-dash-thumb" />
                <span>
                  <b>{u.title}</b>
                  <small className="faint">
                    {u.published ? "Published" : "Draft"} · {formatCount(u.members)} members
                  </small>
                </span>
              </button>
            </li>
          ))}
          {isNew && (
            <li>
              <span className="uni-dash-item is-active">
                <span className="uni-dash-thumb" />
                <span>
                  <b>{draft?.title || "Untitled"}</b>
                  <small className="faint">Not saved yet</small>
                </span>
              </span>
            </li>
          )}
        </ul>

        {draft && (
          <form className="panel dash-panel form-stack uni-editor" onSubmit={save} noValidate>
            <div className="uni-editor-cover">
              <Photo src={draft.cover} alt="Cover preview" sizes="(max-width: 900px) 90vw, 640px" />
              <div className="uni-editor-cover-text">
                <small>{draft.tagline || "Tagline"}</small>
                <b>{draft.title || "Untitled Universe"}</b>
              </div>
            </div>
            <fieldset className="cover-picker">
              <legend className="small muted">Cover</legend>
              {COVER_CHOICES.map((c) => (
                <button type="button" key={c} className={cn("cover-opt", draft.cover === c && "is-active")} onClick={() => set("cover", c)} aria-label="Use this cover" aria-pressed={draft.cover === c}>
                  <Photo src={c} alt="" sizes="80px" />
                </button>
              ))}
              <label className="cover-opt cover-upload" title="Upload (preview only in demo)">
                <Upload size={16} />
                <span className="sr-only">Upload a cover image</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onUpload(e.target.files?.[0])} />
              </label>
            </fieldset>
            {errors.cover && <span className="field-error">{errors.cover}</span>}
            {draft.cover.startsWith("blob:") && <span className="tiny faint">Uploaded image is a local preview — demo mode doesn&apos;t store files.</span>}

            <div className="form-row">
              <div className="field">
                <label htmlFor="u-title">Name</label>
                <input id="u-title" className="input" value={draft.title} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} maxLength={60} />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>
              <div className="field">
                <label htmlFor="u-tag">Tagline</label>
                <input id="u-tag" className="input" value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={80} />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="u-cat">Category</label>
                <select id="u-cat" className="select" value={draft.category} onChange={(e) => set("category", e.target.value as DashUniverse["category"])}>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="u-sched">Schedule</label>
                <input id="u-sched" className="input" value={draft.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="Every Mon, 10am" />
              </div>
            </div>
            <div className="field">
              <span className="small muted">Access</span>
              <div className="dir-cats" role="radiogroup" aria-label="Access">
                {ACCESS_MODES.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={draft.access === m.id} className={cn("chip", draft.access === m.id && "is-active")} onClick={() => set("access", m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="small muted">Membership tiers</span>
              <div className="tier-editor">
                {draft.tiers.map((t, i) => (
                  <div key={t.id} className="tier-edit-row">
                    <input className="input" aria-label={`Tier ${i + 1} name`} value={t.name} onChange={(e) => set("tiers", draft.tiers.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                    <label className="price-input">
                      <span>$</span>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        aria-label={`Tier ${i + 1} monthly price`}
                        value={t.priceCents / 100}
                        onChange={(e) => set("tiers", draft.tiers.map((x, j) => (j === i ? { ...x, priceCents: Math.round(Number(e.target.value) * 100) } : x)))}
                      />
                      <small>/mo</small>
                    </label>
                    <button type="button" className="icon-btn" aria-label={`Remove ${t.name || "tier"}`} disabled={draft.tiers.length <= 1} onClick={() => set("tiers", draft.tiers.filter((_, j) => j !== i))}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={draft.tiers.length >= 5}
                  onClick={() => set("tiers", [...draft.tiers, { id: `t-${Date.now()}`, name: "New tier", priceCents: 1500, interval: "month", perks: [] }])}
                >
                  <Plus size={14} /> Add tier
                </button>
              </div>
              {errors.tiers && <span className="field-error">{errors.tiers}</span>}
            </div>

            <div className="field">
              <span className="small muted">Moderation</span>
              <label className="check">
                <input type="checkbox" checked={draft.slowMode} onChange={(e) => set("slowMode", e.target.checked)} />
                <span>Slow mode in chat (one message every 10s)</span>
              </label>
              <label htmlFor="u-kw" className="small muted" style={{ marginTop: 6 }}>
                Blocked keywords (comma-separated)
              </label>
              <input id="u-kw" className="input" value={draft.keywordFilter} onChange={(e) => set("keywordFilter", e.target.value)} placeholder="spoilers, links" />
            </div>

            <label className="check">
              <input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
              <span>Published (visible on your profile)</span>
            </label>

            <div className="editor-actions">
              <button className="btn btn-light" type="submit">
                {saved ? (
                  <>
                    <Check size={15} /> Saved
                  </>
                ) : isNew ? (
                  "Create Universe"
                ) : (
                  "Save changes"
                )}
              </button>
              {!isNew && UNIVERSES.some((u) => u.slug === draft.id) && (
                <Link href={`/universes/${draft.id}`} className="btn btn-ghost">
                  View public page <ArrowUpRight size={14} />
                </Link>
              )}
              {!isNew &&
                (confirmDelete ? (
                  <span className="confirm-inline">
                    Delete for good?
                    <button
                      type="button"
                      className="btn btn-sm btn-live"
                      onClick={() => {
                        setUnis((l) => l.filter((u) => u.id !== draft.id));
                        setSelected(null);
                        setDraft(null);
                      }}
                    >
                      Delete
                    </button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(false)}>
                      Keep
                    </button>
                  </span>
                ) : (
                  <button type="button" className="btn btn-ghost danger-text" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={14} /> Delete
                  </button>
                ))}
            </div>
          </form>
        )}
        {!draft && !unis.length && <p className="muted">No Universes yet — create your first one.</p>}
      </div>
    </>
  );
}
