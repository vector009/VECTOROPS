import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-paper-200", className)} />;
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({ title, message, action }: { title: string; message?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink-950">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-500">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this", message }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-danger-50 bg-danger-50/40 px-6 py-14 text-center">
      <p className="text-sm font-medium text-danger">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-700">{message}</p>}
    </div>
  );
}
