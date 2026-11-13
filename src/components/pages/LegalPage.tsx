import { PageHero } from "./PageHero";

export type LegalSection = { id: string; title: string; body: string[] };

export function LegalPage({ eyebrow, title, updated, intro, sections }: { eyebrow: string; title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} lines={[title]} lede={intro} compact />
      <div className="shell legal">
        <aside className="legal-toc" aria-label="On this page">
          <span className="tiny faint">Last updated {updated}</span>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </aside>
        <article className="prose">
          <p className="notice">
            Template text for this demo build. It describes how the product is designed to work and must be reviewed by qualified counsel before
            launch.
          </p>
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
