import { cn } from "@/lib/utils";

type Tone = "neutral" | "ok" | "warn" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-paper-200 text-ink-700",
  ok: "bg-ok-50 text-ok",
  warn: "bg-warn-50 text-warn",
  danger: "bg-danger-50 text-danger",
  info: "bg-signal-50 text-signal-700",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium font-mono", tones[tone], className)}>
      {children}
    </span>
  );
}

// Maps common backend enum values to a visual tone so status meaning stays
// consistent across the whole app.
export function toneForStatus(status: string): Tone {
  const ok = ["active", "running", "paid", "connected", "success", "resolved", "completed", "healthy"];
  const warn = ["pending", "provisioning", "syncing", "partially_paid", "due", "draft", "unmapped", "scheduled", "in_progress", "todo"];
  const danger = ["error", "overdue", "churned", "disabled", "offline", "blocked", "void", "cancelled"];
  if (ok.includes(status)) return "ok";
  if (warn.includes(status)) return "warn";
  if (danger.includes(status)) return "danger";
  return "neutral";
}
