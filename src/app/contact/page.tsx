import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { ContactForm } from "@/components/pages/ContactForm";

export const metadata: Metadata = { title: "Contact & support", description: "Get help with your Universe, talk partnerships, or reach the press team." };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Support" lines={["Talk to a human."]} lede="Questions about a Universe, billing, safety, or partnerships — we read everything." compact />
      <section className="shell section-tight contact">
        <ContactForm />
        <aside className="contact-aside" data-reveal>
          <div>
            <b>Safety reports</b>
            <p className="small muted">Use the report button inside any room or chat for the fastest response. Reports are reviewed by people, every day.</p>
          </div>
          <div>
            <b>Creators</b>
            <p className="small muted">Moving an existing community? We&apos;ll help migrate members and set up access.</p>
          </div>
          <div>
            <b>Press</b>
            <p className="small muted">Pick “Press” in the form and we&apos;ll route it to the right person.</p>
          </div>
        </aside>
      </section>
    </>
  );
}
