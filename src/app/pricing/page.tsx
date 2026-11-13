import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";

export const metadata: Metadata = { title: "Pricing", description: "Start free. Pay a small fee only when you earn." };

const PLANS = [
  { name: "Starter", price: "$0", note: "8% platform fee on earnings", cta: "Start free", href: "/signup", features: ["Unlimited public rooms", "Community chat", "Tickets & memberships", "Replays for 7 days", "Up to 500 live viewers"] },
  { name: "Pro", price: "$19", note: "per month · 5% platform fee", cta: "Start Pro", href: "/signup?plan=pro", featured: true, features: ["Everything in Starter", "Private & invite-only Universes", "Replays for 30 days", "Up to 5,000 live viewers", "Advanced analytics", "Custom welcome & branding"] },
  { name: "Studio", price: "Let's talk", note: "for labels, networks & schools", cta: "Contact us", href: "/contact", features: ["Everything in Pro", "Multiple creators per workspace", "Volume pricing", "Priority support", "SSO & audit logs"] },
];

const FAQ = [
  { q: "Do fans need an account?", a: "Fans create a free account the first time they join a Universe. It takes an email and a name — no app download required." },
  { q: "When do I get paid?", a: "Monthly. Payouts settle to your connected account with a statement showing every membership, ticket and fee." },
  { q: "Which access keys are supported?", a: "Free follows, memberships, tickets, invite codes, private approvals, merch order codes and wallet-held collectibles. Mix them per tier." },
  { q: "Can I move my community later?", a: "Yes. You can export your member list (emails of members who opted in) and your content at any time." },
  { q: "Is this site the real product?", a: "This build is a functional front-end demo. Rooms, chat, sign-in and checkout run in demo mode in your browser until real services are connected." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" lines={["Free to start.", "Fair when you earn."]} lede="No setup fees and no lock-in. A small platform fee applies only to money you make on Leam." compact />
      <section className="shell section-tight">
        <div className="plan-grid" data-reveal-stagger>
          {PLANS.map((p) => (
            <article key={p.name} className={`plan${p.featured ? " is-featured" : ""}`}>
              <span className="small muted">{p.name}</span>
              <b className="plan-price">{p.price}</b>
              <span className="small faint">{p.note}</span>
              <Link href={p.href} className={`btn ${p.featured ? "btn-light" : "btn-ghost"}`}>
                {p.cta}
              </Link>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Check size={14} /> {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="tiny faint" style={{ marginTop: 16 }}>
          Payment processing fees are charged by the payment provider at cost. Prices in USD.
        </p>
      </section>
      <section id="faq" className="shell section" aria-labelledby="faq-h">
        <h2 id="faq-h" className="h2" data-reveal style={{ marginBottom: 32 }}>
          Questions
        </h2>
        <div className="faq" data-reveal-stagger="0.05">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
