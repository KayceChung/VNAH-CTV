export function LoadingSpinner({ label = "Dang xu ly..." }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}