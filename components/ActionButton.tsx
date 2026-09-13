"use client";

import { useState } from "react";

export function ActionButton({ action, children, className = "rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-950" }: { action: () => Promise<unknown>; children: React.ReactNode; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run() { setBusy(true); setError(null); try { await action(); window.location.reload(); } catch (e) { setError(e instanceof Error ? e.message : "Action could not be completed."); } finally { setBusy(false); } }
  return <span className="inline-flex items-end gap-2"><button type="button" disabled={busy} onClick={run} className={className}>{busy ? "WORKING…" : children}</button>{error && <span role="alert" className="text-[11px] text-red-300">{error}</span>}</span>;
}
