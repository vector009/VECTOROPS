export function FullScreenState({
  kind,
  title,
  message,
}: {
  kind: "loading" | "error";
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-paper-50 px-6 text-center">
      {kind === "loading" ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-ink-950" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-danger" />
      )}
      {title && <p className="text-sm font-semibold text-ink-950">{title}</p>}
      {message && <p className="max-w-sm text-sm text-ink-500">{message}</p>}
    </div>
  );
}
