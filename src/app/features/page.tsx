import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Ban, Bell, Clapperboard, Gauge, Globe, ShieldCheck, Smartphone, Ticket } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { ChatPhone, LivePhone, MembershipPhone, StagePhone } from "@/components/cards/PhoneCards";
import { IMG } from "@/lib/images";

export const metadata: Metadata = { title: "Features", description: "Live rooms, shared stages, always-on chat and access rules — everything inside a Universe." };

const BLOCKS = [
  { id: "access", eyebrow: "Set your rules", title: "Access that fits your audience", text: "Free, ticketed, subscription, invite-only, private approvals or collectible-gated. Combine them, change them later, and nobody has to move.", Phone: MembershipPhone },
  { id: "rooms", eyebrow: "Host rooms", title: "Go live in one tap", text: "Schedule a weekly show or start a room on a whim. Members get notified, replays are saved for 30 days, and every room has its own chat.", Phone: LivePhone },
  { id: "stage", eyebrow: "Share the stage", title: "Bring people up", text: "Invite guests ahead of time or let the audience request to speak. Hosts and moderators approve, mute and move people with a tap.", Phone: StagePhone },
  { id: "chat", eyebrow: "Keep it going", title: "The chat never closes", text: "Threads, reactions, pinned messages and member badges keep the community talking before, during and after every stream.", Phone: ChatPhone },
];

const MORE = [
  { Icon: ShieldCheck, title: "Moderation tools", text: "Roles, slow mode, keyword filters and a shared moderation log." },
  { Icon: Ban, title: "Safety by default", text: "Block, report and remove in two taps. Governance policies are public." },
  { Icon: Bell, title: "Smart reminders", text: "Members get one reminder before rooms they care about — not a firehose." },
  { Icon: Clapperboard, title: "Replays & clips", text: "Save rooms, trim highlights and share clips back to social." },
  { Icon: Ticket, title: "Tickets & passes", text: "Single events, season passes and member discounts." },
  { Icon: Gauge, title: "Creator analytics", text: "Retention, revenue and the members who show up most." },
  { Icon: Globe, title: "Your own link", text: "A clean public page for every Universe with Open Graph previews." },
  { Icon: Smartphone, title: "Mobile first", text: "Rooms and chat are built for phones, and work in any browser." },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero eyebrow="Features" lines={["Everything a", "Universe needs."]} lede="Four building blocks — rules, rooms, stage and chat — and the quiet tools that keep a community healthy." image={IMG.mixer} />
      {BLOCKS.map(({ id, eyebrow, title, text, Phone }, i) => (
        <section key={id} id={id} className={`shell section-tight feature-block${i % 2 ? " is-flip" : ""}`}>
          <div className="fb-copy">
            <span className="eyebrow" data-reveal>
              {eyebrow}
            </span>
            <h2 className="h2" data-reveal>
              {title}
            </h2>
            <p className="lede muted" data-reveal>
              {text}
            </p>
          </div>
          <div className="fb-visual" data-reveal>
            <div className="fb-phone">
              <Phone />
            </div>
          </div>
        </section>
      ))}
      <section className="shell section" aria-labelledby="more-h">
        <h2 id="more-h" className="h2" data-reveal style={{ marginBottom: 40 }}>
          And the details that matter.
        </h2>
        <div className="icon-grid" data-reveal-stagger="0.05">
          {MORE.map(({ Icon, title, text }) => (
            <div key={title} className="icon-item">
              <Icon size={18} className="icon-item-i" aria-hidden />
              <b>{title}</b>
              <p className="small muted">{text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48 }} data-reveal>
          <Link href="/signup" className="btn btn-light btn-lg">
            Create a Universe <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
