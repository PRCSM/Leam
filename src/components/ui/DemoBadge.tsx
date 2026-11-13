import { FlaskConical } from "lucide-react";

export function DemoBadge({ label = "Demo mode" }: { label?: string }) {
  return (
    <span className="demo-badge" title="This interaction runs locally in your browser. No live service is connected.">
      <FlaskConical size={12} aria-hidden />
      {label}
    </span>
  );
}
