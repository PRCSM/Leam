export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="loader-bar" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
