import { Photo } from "@/components/ui/Photo";
import { SplitLines } from "@/components/motion/SplitLines";

type Props = {
  eyebrow: string;
  lines: React.ReactNode[];
  lede?: React.ReactNode;
  image?: string;
  imagePosition?: string;
  children?: React.ReactNode;
  compact?: boolean;
};

/** Shared editorial page header: eyebrow, masked headline, optional atmospheric photo. */
export function PageHero({ eyebrow, lines, lede, image, imagePosition, children, compact }: Props) {
  return (
    <section className={`page-hero${image ? " has-image" : ""}${compact ? " is-compact" : ""}`}>
      {image && (
        <div className="page-hero-media" aria-hidden>
          <div className="page-hero-photo" data-parallax="0.08">
            <Photo src={image} alt="" sizes="100vw" priority position={imagePosition} />
          </div>
          <div className="page-hero-shade" />
        </div>
      )}
      <div className="shell page-hero-inner">
        <span className="eyebrow" data-reveal="12">
          {eyebrow}
        </span>
        <SplitLines as="h1" className="h1 page-title" lines={lines} />
        {lede && (
          <p className="lede muted" data-reveal>
            {lede}
          </p>
        )}
        {children}
        <hr className="hr page-hero-rule" data-line />
      </div>
    </section>
  );
}
