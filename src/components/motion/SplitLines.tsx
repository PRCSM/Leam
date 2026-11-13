/** Splits a headline into masked lines for data-split. Pass lines explicitly for precise breaks. */
export function SplitLines({ lines, as: Tag = "h2", className }: { lines: React.ReactNode[]; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  return (
    <Tag className={className} data-split>
      {lines.map((l, i) => (
        <span className="mask" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
