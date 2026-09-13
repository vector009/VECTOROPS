"use client";
import { useTransition } from "react";
import { requestAutomationControl } from "@/lib/actions";
import type { AutomationState } from "@/lib/types";

export function AutomationControl({workflowId,actual,desired,admin=false}:{workflowId:string;actual:AutomationState;desired:AutomationState;admin?:boolean}){
 const[pending,startTransition]=useTransition(); const next=actual==="running"?"paused":"running";
 if(admin)return <div className="rounded-xl border border-amber-400/10 bg-amber-400/[.03] px-3 py-2 text-xs text-amber-100/75">Control service not connected · no privileged n8n operation is claimed.</div>;
 const act=()=>startTransition(async()=>{try{await requestAutomationControl(workflowId,next)}catch{}});
 return <div className="flex items-center gap-2"><div className="text-right text-[10px] uppercase tracking-wide text-slate-500"><div>Desired {desired}</div><div>Actual {actual}</div></div><button disabled={pending} onClick={act} className="rounded-xl border border-white/9 bg-white/[.04] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[.07] disabled:opacity-50">{pending?"Syncing…":next==="paused"?"Pause":"Resume"}</button></div>
}
