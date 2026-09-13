"use client";
import { useTransition } from "react";
import { requestAutomationControl } from "@/lib/actions";
import type { AutomationState } from "@/lib/types";

export function AutomationControl({ workflowId, actual, desired }: { workflowId:string; actual:AutomationState; desired:AutomationState }) {
  const [pending,startTransition] = useTransition();
  const next = actual === "running" ? "paused" : "running";
  function act(){ startTransition(async()=>{ try { await requestAutomationControl(workflowId,next); } catch { /* server action exposes only safe error */ } }); }
  return <div className="flex items-center gap-2"><div className="text-right text-[10px] uppercase tracking-wide text-slate-500"><div>Desired {desired}</div><div>Actual {actual}</div></div><button disabled={pending} onClick={act} className="rounded-xl border border-white/9 bg-white/[.04] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[.07] disabled:opacity-50">{pending?"Syncing…":next==="paused"?"Pause":"Resume"}</button></div>;
}
