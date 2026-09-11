import { cn } from "@/lib/utils";

export function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "ok" | "warn" | "danger" }) {
  const toneClass = tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : tone === "danger" ? "text-danger" : "text-ink-950";
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-subtle">
      <p className="text-xs text-ink-500">{label}</p>
      <p className={cn("mt-1.5 font-mono text-2xl font-semibold tabular", toneClass)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
