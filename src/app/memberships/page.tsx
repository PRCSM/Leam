import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { EarningsCalculator } from "@/components/pages/EarningsCalculator";
import { Monetization } from "@/components/home/Sections";
import { IMG } from "@/lib/images";

export const metadata: Metadata = { title: "Memberships", description: "How creators earn on Leam: memberships, tickets, premium events, merch and exclusive access." };

export default function MembershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Memberships"
        lines={["Followers are", "a number.", "Members are people."]}
        lede="Leam is built around recurring relationships, not one-off views. Here's how the money works — plainly."
        image={IMG.drumsWarm}
      />
      <Monetization />
      <section className="shell section" aria-labelledby="calc-h">
        <div className="section-head">
          <span className="eyebrow" data-reveal>
            Estimate
          </span>
          <h2 id="calc-h" className="h2" data-reveal>
            What could your Universe earn?
          </h2>
          <p className="lede muted" data-reveal>
            An illustration, not a promise. Real results depend on your audience, pricing and schedule.
          </p>
        </div>
        <EarningsCalculator />
      </section>
      <section className="shell section-tight" aria-labelledby="how-h">
        <h2 id="how-h" className="h3" data-reveal style={{ marginBottom: 24 }}>
          How payouts work
        </h2>
        <ol className="steps-list" data-reveal-stagger>
          <li>
            <b>Fans pay through a hosted checkout.</b> Card details are handled by the payment provider, never stored by Leam.
          </li>
          <li>
            <b>Access starts after confirmation.</b> Memberships and tickets unlock only once payment succeeds.
          </li>
          <li>
            <b>You keep the majority.</b> The platform fee depends on your plan (see pricing); processor fees are passed through at cost.
          </li>
          <li>
            <b>Payouts are monthly.</b> Funds settle to your connected account once a month, with a full statement.
          </li>
        </ol>
      </section>
    </>
  );
}
