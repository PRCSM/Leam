import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { Photo } from "@/components/ui/Photo";
import { FinalCTA } from "@/components/home/Sections";
import { IMG } from "@/lib/images";

export const metadata: Metadata = { title: "About", description: "Leam Collective builds homes for communities that outgrew the feed." };

const VALUES = [
  { t: "Depth over reach", d: "We measure success by who comes back, not who scrolls past." },
  { t: "Creators own the room", d: "Your rules, your pricing, your members — exportable any time." },
  { t: "Safe by design", d: "Moderation tools ship before growth features. Policies are public." },
  { t: "Plain money", d: "Fees are listed in one place, in plain language, with no surprises." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About · Leam Collective" lines={["Communities", "outgrew the feed."]} lede="Leam started with a simple observation: the best part of every livestream happened in the chat after it ended. So we built a place for that." image={IMG.heroDancer} imagePosition="60% 30%" />

      <section className="shell section about-story">
        <div className="about-text" data-reveal>
          <p className="lede">
            Social platforms are great at reach and terrible at belonging. Creators end up renting attention from algorithms while their most loyal
            fans get the same experience as a passer-by.
          </p>
          <p className="lede muted">
            A Universe flips that. It&apos;s a recurring set of live rooms and a chat that never closes, with access you control — so the people who
            care most get something worth showing up for.
          </p>
        </div>
        <div className="about-photo" data-reveal>
          <Photo src={IMG.onAir} alt="A recording studio lit up at night" sizes="(max-width: 900px) 90vw, 480px" />
        </div>
      </section>

      <section className="shell section-tight" aria-label="Leam in numbers (illustrative)">
        <div className="stats grid-4" data-reveal-stagger>
          <div>
            <b data-count="2400" data-suffix="+">0</b>
            <span className="small muted">Universes</span>
          </div>
          <div>
            <b data-count="38" data-suffix="K">0</b>
            <span className="small muted">rooms hosted</span>
          </div>
          <div>
            <b data-count="92" data-suffix="%">0</b>
            <span className="small muted">kept by creators on Starter</span>
          </div>
          <div>
            <b data-count="61" data-suffix="%">0</b>
            <span className="small muted">of members join a second room</span>
          </div>
        </div>
        <p className="tiny faint" style={{ marginTop: 16 }}>
          Illustrative figures for this demo build.
        </p>
      </section>

      <section className="shell section" aria-labelledby="values-h">
        <h2 id="values-h" className="h2" data-reveal style={{ marginBottom: 40 }}>
          What we believe
        </h2>
        <div className="values" data-reveal-stagger>
          {VALUES.map((v, i) => (
            <div key={v.t} className="value">
              <span className="hiw-n">0{i + 1}</span>
              <b>{v.t}</b>
              <p className="muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
