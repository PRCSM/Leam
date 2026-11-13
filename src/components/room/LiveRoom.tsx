"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Hand,
  Heart,
  Link2,
  LogOut,
  Mic,
  MicOff,
  Radio,
  Send,
  Sparkles,
  Users,
  Video,
  VideoOff,
  Flame,
} from "lucide-react";
import { Photo, Avatar } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { useFloatingReactions } from "@/components/ui/useFloatingReactions";
import { IMG } from "@/lib/images";
import { PEOPLE, SEED_CHAT, getCreator, getRoom, getUniverse, type ChatMessage } from "@/lib/data";
import { useDemoState } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

type StageState = "audience" | "requested" | "on-stage";

/**
 * Live room interface. Without LiveKit credentials every signal here is
 * simulated locally (labelled in the UI). With credentials, the page passes
 * `liveConfigured` and the token route can mint a real room token — the
 * WebRTC client wiring point is marked below.
 */
export function LiveRoom({ roomId, compact, liveConfigured = false }: { roomId: string; compact?: boolean; liveConfigured?: boolean }) {
  const room = getRoom(roomId)!;
  const host = getCreator(room.host)!;
  const universe = getUniverse(room.universe)!;
  const [viewers, setViewers] = useState(room.viewers || 48);
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [stage, setStage] = useState<StageState>("audience");
  const [toast, setToast] = useState("");
  const [hearts, setHearts] = useState(0);
  const { layer, burst } = useFloatingReactions();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulated audience drift.
  useEffect(() => {
    const t = window.setInterval(() => setViewers((v) => Math.max(12, v + Math.round((Math.random() - 0.4) * 4))), 2600);
    return () => window.clearInterval(t);
  }, []);

  // Simulated host approval for request-to-speak.
  useEffect(() => {
    if (stage !== "requested") return;
    const t = window.setTimeout(() => {
      setStage("on-stage");
      flash(`${host.name.split(" ")[0]} brought you on stage`);
    }, 2400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Local camera preview only (never transmitted in demo mode).
  useEffect(() => {
    if (!cam) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        setCam(false);
        flash("Camera permission was not granted");
      });
    return () => {
      cancelled = true;
    };
  }, [cam]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  }

  const share = async () => {
    const url = `${window.location.origin}/rooms/${room.id}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("Invite link copied");
    } catch {
      flash(url);
    }
  };

  const react = () => {
    setHearts((h) => h + 1);
    burst("♥");
  };

  const speakers = PEOPLE.slice(1, 5);

  return (
    <div className={cn("live-room", compact && "is-compact")}>
      <div className="lr-main">
        <div className="lr-stage" data-cursor="watch">
          <Photo src={room.image} alt={`${host.name} hosting ${room.title}`} sizes="(max-width: 900px) 100vw, 70vw" position="50% 30%" priority={!compact} />
          <div className="lr-shade" />
          <div className="reaction-layer lr-reactions" ref={layer} aria-hidden />
          <div className="lr-top">
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
            <span className="lr-count" aria-live="off">
              <Users size={13} /> <span className="tabular">{viewers}</span>
            </span>
            <span className="lr-mode">{liveConfigured ? "Connected" : "Simulated stream"}</span>
          </div>
          <div className="lr-title">
            <span className="eyebrow">{universe.tagline}</span>
            <h2>{room.title}</h2>
            <span className="small muted">
              Hosted by <Link href={`/creators/${host.slug}`}>{host.name}</Link>
            </span>
          </div>
          {stage === "on-stage" && (
            <div className="lr-self">
              {cam ? <video ref={videoRef} autoPlay playsInline muted /> : <Avatar src={IMG.manJacket} alt="You" size={44} />}
              <span>You {mic ? "" : "· muted"}</span>
            </div>
          )}
        </div>

        <div className="lr-speakers" aria-label="On stage">
          {speakers.map((p, i) => (
            <div key={p.id} className="lr-speaker">
              <span className={cn("lr-speaker-av", i % 2 === 0 && "is-speaking")}>
                <Photo src={p.image} alt="" sizes="64px" />
              </span>
              <span className="tiny">{p.name}</span>
            </div>
          ))}
          {stage === "on-stage" && (
            <div className="lr-speaker">
              <span className={cn("lr-speaker-av", mic && "is-speaking")}>
                <Photo src={IMG.manJacket} alt="" sizes="64px" />
              </span>
              <span className="tiny">You</span>
            </div>
          )}
        </div>

        <div className="lr-controls" role="toolbar" aria-label="Room controls">
          <button
            className={cn("lr-btn", stage !== "on-stage" && "is-disabled")}
            onClick={() => (stage === "on-stage" ? setMic((m) => !m) : flash("Request to speak to unmute"))}
            aria-pressed={mic}
            aria-label={mic ? "Mute microphone" : "Unmute microphone"}
          >
            {mic ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
          <button
            className={cn("lr-btn", stage !== "on-stage" && "is-disabled")}
            onClick={() => (stage === "on-stage" ? setCam((c) => !c) : flash("Cameras are for people on stage"))}
            aria-pressed={cam}
            aria-label={cam ? "Turn camera off" : "Preview camera"}
          >
            {cam ? <Video size={16} /> : <VideoOff size={16} />}
          </button>
          <button
            className={cn("lr-btn lr-btn-wide", stage !== "audience" && "is-on")}
            onClick={() => {
              if (stage === "audience") {
                setStage("requested");
                flash("Request sent to the host");
              } else {
                setStage("audience");
                setMic(false);
                setCam(false);
              }
            }}
            aria-pressed={stage !== "audience"}
          >
            <Hand size={16} />
            {stage === "audience" ? "Request to speak" : stage === "requested" ? "Waiting… (cancel)" : "Leave stage"}
          </button>
          <button className="lr-btn" onClick={react} aria-label={`Send a heart (${hearts} sent)`}>
            <Heart size={16} />
          </button>
          <button className="lr-btn" onClick={() => burst("🔥")} aria-label="Send fire">
            <Flame size={16} />
          </button>
          <button className="lr-btn" onClick={share} aria-label="Copy invite link">
            <Link2 size={16} />
          </button>
          <Link href={`/universes/${universe.slug}`} className="lr-btn lr-leave" aria-label="Leave room">
            <LogOut size={16} />
            <span>Leave</span>
          </Link>
        </div>
        <div className="lr-toast" role="status" aria-live="polite">
          {toast && <span>{toast}</span>}
        </div>
      </div>

      <ChatPanel storageKey={`room:${room.id}`} title={`${universe.title} chat`} />

      {!liveConfigured && !compact && (
        <p className="lr-note small faint">
          <Radio size={12} /> Demo mode: video, audience and approvals are simulated in your browser. Connect LiveKit (see README) to stream
          for real. Camera preview stays on this device.
        </p>
      )}
    </div>
  );
}

export function ChatPanel({ storageKey, title }: { storageKey: string; title: string }) {
  const [messages, setMessages] = useDemoState<ChatMessage[]>(storageKey, SEED_CHAT);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim().slice(0, 500);
    if (!text) return;
    setMessages((m) =>
      [
        ...m,
        {
          id: `l-${Date.now()}`,
          author: "You",
          avatar: IMG.manJacket,
          text,
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          mine: true,
        },
      ].slice(-80)
    );
    setDraft("");
  };

  return (
    <aside className="chat-panel" aria-label={title}>
      <header className="chat-head">
        <strong>
          <Sparkles size={13} /> {title}
        </strong>
        <span className="tiny faint">{messages.length} messages</span>
      </header>
      <ol className="chat-list" ref={listRef} data-lenis-prevent aria-live="polite">
        {messages.map((m) => (
          <li key={m.id} className={cn("chat-item", m.mine && "is-mine")}>
            <Avatar src={m.avatar} alt="" size={26} />
            <div>
              <span className="chat-meta">
                <b>{m.author}</b>
                {m.badge && <em>{m.badge}</em>}
                <time>{m.time}</time>
              </span>
              <p>{m.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <form className="chat-form" onSubmit={send}>
        <label htmlFor={`${storageKey}-msg`} className="sr-only">
          Message
        </label>
        <input id={`${storageKey}-msg`} className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Say something nice" maxLength={500} autoComplete="off" />
        <button className="icon-btn chat-send" type="submit" aria-label="Send" disabled={!draft.trim()}>
          <Send size={15} />
        </button>
      </form>
      <span className="chat-sparkle" aria-hidden>
        <Sparkle size={10} />
      </span>
    </aside>
  );
}
