"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Download,
  Hand,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  RefreshCcw,
  Ticket,
  UserPlus,
  Video,
  VideoOff,
} from "lucide-react";
import { Photo, Avatar } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { IMG } from "@/lib/images";
import { PEOPLE, SEED_CHAT, getUniverse, type ChatMessage, type Person } from "@/lib/data";
import { useDemoState } from "@/lib/demo-store";
import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn, formatPrice } from "@/lib/utils";
import { MembershipModal, ParticipantsModal, RoomPreviewModal } from "./PhoneModals";
import { useFloatingReactions } from "@/components/ui/useFloatingReactions";

/* ---------------------------------------------------------------------- */
/*  Card 1 — Universe membership                                           */
/* ---------------------------------------------------------------------- */
export function MembershipPhone({ interactive = true }: { interactive?: boolean }) {
  const universe = getUniverse("culture-unfiltered")!;
  const [open, setOpen] = useState(false);
  const [joined] = useDemoState<string[]>("joined", []);
  const isMember = joined.includes(universe.slug);

  return (
    <PhoneFrame><article className="phone phone-membership" data-cursor={interactive ? "join" : undefined} aria-label="Universe membership preview">
      <div className="pm-top">
        <span className="pm-brand">
          <Sparkle size={11} /> {universe.tagline}
        </span>
        <MoreHorizontal size={14} aria-hidden />
      </div>
      <div className="pm-avatars" aria-hidden>
        <Avatar src={IMG.manHat} alt="" size={30} className="pm-av-1" />
        <Avatar src={IMG.womanRedHair} alt="" size={30} className="pm-av-2" />
      </div>
      <h3 className="pm-title">
        Behind the
        <br />
        Scenes
      </h3>
      <div className="pm-laurel" aria-label={`Since ${universe.since}`}>
        <Laurel />
        <span>
          <small>SINCE</small>
          {universe.since}
        </span>
        <Laurel flip />
      </div>
      <div className="pm-meta">
        <span>
          <Video size={11} aria-hidden /> {universe.schedule}
        </span>
        <span>
          <MessageCircle size={11} aria-hidden /> Chat
        </span>
      </div>
      <p className="pm-desc">{universe.description}</p>
      <button className="pm-cta" onClick={() => interactive && setOpen(true)} tabIndex={interactive ? 0 : -1}>
        <Ticket size={12} aria-hidden />
        {isMember ? "Member · Manage" : `${formatPrice(universe.tiers[1].priceCents)} a month`}
      </button>
      {interactive && <MembershipModal open={open} onClose={() => setOpen(false)} universe={universe} />}
    </article></PhoneFrame>
  );
}

function Laurel({ flip }: { flip?: boolean }) {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M11 21C5 18 2.5 12 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {[5, 9, 13, 17].map((y, i) => (
        <ellipse key={y} cx={i % 2 ? 2.6 : 6.4} cy={y} rx="2.4" ry="1.2" transform={`rotate(${i % 2 ? 40 : -40} ${i % 2 ? 2.6 : 6.4} ${y})`} fill="currentColor" />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Card 2 — Live stream                                                   */
/* ---------------------------------------------------------------------- */
export function LivePhone({ interactive = true }: { interactive?: boolean }) {
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState(72);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const { layer, burst } = useFloatingReactions();

  const react = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((n) => n + 1);
    burst("♥");
  };

  return (
    <PhoneFrame><article className="phone phone-live" data-cursor={interactive ? "watch" : undefined} aria-label="Live stream preview">
      <button className="phone-hit" onClick={() => interactive && setOpen(true)} aria-label="Open live room preview" tabIndex={interactive ? 0 : -1} />
      <Photo src={IMG.womanLight} alt="Creator streaming live" sizes="(max-width: 900px) 70vw, 260px" className="pl-photo" position="50% 30%" />
      <Photo src={IMG.manJacket} alt="Guest on stage" sizes="80px" className="pl-pip" />
      <div className="pl-shade" />
      <div className="reaction-layer" ref={layer} aria-hidden />
      <div className="pl-bottom">
        <div className="pl-name">
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
          <strong>Amara</strong>
          <Sparkle size={11} />
        </div>
        <div className="pl-controls">
          <button aria-label="Flip camera (demo)" tabIndex={interactive ? 0 : -1} onClick={(e) => e.stopPropagation()}>
            <RefreshCcw size={13} />
          </button>
          <button aria-pressed={!cam} aria-label={cam ? "Turn camera off (demo)" : "Turn camera on (demo)"} tabIndex={interactive ? 0 : -1} onClick={(e) => (e.stopPropagation(), setCam((v) => !v))}>
            {cam ? <Video size={13} /> : <VideoOff size={13} />}
          </button>
          <button aria-pressed={!mic} aria-label={mic ? "Mute (demo)" : "Unmute (demo)"} tabIndex={interactive ? 0 : -1} onClick={(e) => (e.stopPropagation(), setMic((v) => !v))}>
            {mic ? <Mic size={13} /> : <MicOff size={13} />}
          </button>
          <button aria-label="Invite guest (demo)" tabIndex={interactive ? 0 : -1} onClick={(e) => e.stopPropagation()}>
            <UserPlus size={13} />
          </button>
          <button aria-label="Save clip (demo)" tabIndex={interactive ? 0 : -1} onClick={(e) => e.stopPropagation()}>
            <Download size={13} />
          </button>
        </div>
        <div className="pl-actions">
          <Link href="/rooms/thursday-fit" className="pl-leave" tabIndex={interactive ? 0 : -1} onClick={(e) => e.stopPropagation()}>
            Leave
          </Link>
          <button className="pl-pill" onClick={react} aria-label={`Send a heart, ${likes} so far`} tabIndex={interactive ? 0 : -1}>
            <Avatar src={IMG.womanBlack} alt="" size={16} />
            <span className="tabular">{likes}</span>
          </button>
          <span className="pl-pill">
            <MessageCircle size={11} aria-hidden /> 2
          </span>
        </div>
      </div>
      {interactive && <RoomPreviewModal open={open} onClose={() => setOpen(false)} roomId="thursday-fit" />}
    </article></PhoneFrame>
  );
}

/* ---------------------------------------------------------------------- */
/*  Card 3 — Group stage                                                   */
/* ---------------------------------------------------------------------- */
export function StagePhone({ interactive = true }: { interactive?: boolean }) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState<Person | null>(null);
  const [hands, setHands] = useState(2);
  const [raised, setRaised] = useState(false);
  const [speaking] = useState<Record<string, boolean>>({ p1: true, p3: true, p5: true, p7: true });
  const big = PEOPLE.slice(0, 2);
  const small = PEOPLE.slice(2, 8);

  const openPerson = (p: Person | null) => {
    if (!interactive) return;
    setFocus(p);
    setOpen(true);
  };

  return (
    <PhoneFrame><article className="phone phone-stage" data-cursor={interactive ? "join" : undefined} aria-label="Group live room preview">
      <div className="ps-status">
        <span>9:41</span>
        <span className="ps-room">
          <Sparkle size={9} /> 0.1 for every
        </span>
        <span className="ps-bar" />
      </div>
      <div className="ps-big">
        {big.map((p) => (
          <button key={p.id} className="ps-tile" onClick={() => openPerson(p)} tabIndex={interactive ? 0 : -1} aria-label={`${p.name}, ${p.role}`}>
            <Photo src={p.image} alt="" sizes="120px" />
            <span className="ps-label">
              {p.name}
              {p.id === "p2" && <Sparkle size={8} />}
            </span>
            {speaking[p.id] && <span className="ps-speaking" aria-hidden />}
          </button>
        ))}
      </div>
      <div className="ps-grid">
        {small.map((p) => (
          <button key={p.id} className="ps-mini" onClick={() => openPerson(p)} tabIndex={interactive ? 0 : -1} aria-label={`${p.name}, ${p.role}`}>
            <span className={cn("ps-mini-av", speaking[p.id] && "is-speaking")}>
              <Photo src={p.image} alt="" sizes="60px" />
            </span>
            <span className="ps-mini-name">
              {p.name}
              <i className={cn("ps-dot", speaking[p.id] && "on")} aria-hidden />
            </span>
          </button>
        ))}
      </div>
      <div className="ps-controls" aria-hidden>
        <RefreshCcw size={12} />
        <Video size={12} />
        <Mic size={12} />
        <UserPlus size={12} />
        <Download size={12} />
      </div>
      <div className="ps-pills">
        <button className="ps-pill" onClick={() => openPerson(null)} tabIndex={interactive ? 0 : -1} aria-label="See all 72 people in the room">
          <Avatar src={IMG.womanBlack} alt="" size={14} /> 72
        </button>
        <span className="ps-pill">
          <MessageCircle size={10} aria-hidden /> 11
        </span>
        <button
          className={cn("ps-pill", raised && "is-on")}
          aria-pressed={raised}
          aria-label={raised ? "Lower hand" : "Request to speak"}
          tabIndex={interactive ? 0 : -1}
          onClick={() => {
            setRaised((r) => !r);
            setHands((h) => (raised ? h - 1 : h + 1));
          }}
        >
          <Hand size={10} aria-hidden /> {hands}
        </button>
      </div>
      {interactive && <ParticipantsModal open={open} onClose={() => setOpen(false)} focus={focus} onFocus={setFocus} />}
    </article></PhoneFrame>
  );
}

/* ---------------------------------------------------------------------- */
/*  Card 4 — Community chat                                                */
/* ---------------------------------------------------------------------- */
export function ChatPhone({ interactive = true, storageKey = "chat:home" }: { interactive?: boolean; storageKey?: string }) {
  const [messages, setMessages] = useDemoState<ChatMessage[]>(storageKey, SEED_CHAT);
  const [draft, setDraft] = useState("");
  const [hearts, setHearts] = useDemoState<Record<string, number>>(`${storageKey}:hearts`, { m1: 3, m5: 1 });
  const listRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim().slice(0, 280);
    if (!text) return;
    const now = new Date();
    const msg: ChatMessage = {
      id: `local-${now.getTime()}`,
      author: "You",
      avatar: IMG.manJacket,
      text,
      time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", ""),
      mine: true,
    };
    setMessages((m) => [...m, msg].slice(-40));
    setDraft("");
    requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
      const last = list.lastElementChild;
      if (last && !prefersReducedMotion()) ensureGsap().gsap.fromTo(last, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    });
  };

  return (
    <PhoneFrame><article className="phone phone-chat" aria-label="Community chat preview">
      <div className="pc-media">
        <Photo src={IMG.manSilhouette} alt="" sizes="260px" position="50% 40%" />
        <Photo src={IMG.womanCloak} alt="" sizes="70px" className="pc-pip" />
        <div className="pc-banner">
          <span className="pc-pinned">
            <Mic size={9} aria-hidden /> <b>Mufeeza:</b> How is it…
          </span>
          <span className="pc-rewards">
            <Sparkle size={8} /> Rewards
          </span>
        </div>
      </div>
      <div className="pc-thread" ref={listRef} data-lenis-prevent aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={cn("pc-msg", m.mine && "is-mine")}>
            {!m.mine && <Avatar src={m.avatar} alt="" size={16} />}
            <div className="pc-bubble-wrap">
              {!m.mine && (
                <span className="pc-author">
                  {m.author}
                  {m.badge && <em>{m.badge}</em>}
                </span>
              )}
              <button
                className="pc-bubble"
                tabIndex={interactive ? 0 : -1}
                onDoubleClick={() => setHearts((h) => ({ ...h, [m.id]: (h[m.id] ?? 0) + 1 }))}
                onClick={(e) => e.detail === 0 && setHearts((h) => ({ ...h, [m.id]: (h[m.id] ?? 0) + 1 }))}
                aria-label={`${m.text}. ${hearts[m.id] ?? 0} hearts. Double-click or press Enter to react.`}
              >
                {m.text}
                {!!hearts[m.id] && (
                  <span className="pc-heart">
                    <Heart size={8} fill="currentColor" /> {hearts[m.id]}
                  </span>
                )}
              </button>
              <span className="pc-time">{m.time}</span>
            </div>
          </div>
        ))}
        <div className="pc-media-row" aria-hidden>
          <Photo src={IMG.womanChair} alt="" sizes="80px" />
          <Photo src={IMG.manGrid} alt="" sizes="80px" />
        </div>
      </div>
      <form className="pc-composer" onSubmit={send}>
        <button type="button" className="pc-plus" aria-label="Attach (demo)" tabIndex={interactive ? 0 : -1}>
          <ImageIcon size={11} />
        </button>
        <label className="sr-only" htmlFor={inputId}>
          Send a message
        </label>
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Send a message"
          maxLength={280}
          autoComplete="off"
          tabIndex={interactive ? 0 : -1}
        />
        <button type="submit" className="pc-send" aria-label="Send message" disabled={!draft.trim()} tabIndex={interactive ? 0 : -1}>
          <ArrowUp size={11} />
        </button>
      </form>
    </article></PhoneFrame>
  );
}

/** The frame is the size container; the phone inside scales its type to the frame width. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return <div className="phone-frame">{children}</div>;
}

export function PhoneRow() {
  return (
    <div className="phone-row" data-phone-row>
      <MembershipPhone />
      <LivePhone />
      <StagePhone />
      <ChatPhone />
    </div>
  );
}

