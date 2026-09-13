"use client";
import { useState } from "react";
import { churnClient, reactivateClient, resetClientPassword } from "@/lib/actions";

export function ClientLifecycleActions({ clientId, clientStatus, subscriptionId }: { clientId:string; clientStatus:string; subscriptionId?:string|null }) {
  const [busy,setBusy]=useState(false); const [error,setError]=useState<string|null>(null); const [password,setPassword]=useState("");
  async function run(fn:()=>Promise<unknown>) { setBusy(true); setError(null); try { await fn(); window.location.reload(); } catch(e) { setError(e instanceof Error?e.message:"Action failed."); } finally { setBusy(false); } }
  return <div className="flex flex-wrap items-end gap-2">
    {clientStatus === "churned" || clientStatus === "archived" ? <button type="button" disabled={busy} onClick={()=>run(()=>reactivateClient(clientId,subscriptionId||null))} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950">Reactivate</button> : <button type="button" disabled={busy} onClick={()=>{ if(confirm("Churn this client? Historical data is preserved, but service access will be blocked.")) run(()=>churnClient(clientId)); }} className="rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-2.5 text-sm font-semibold text-red-200">Churn client</button>}
    <form onSubmit={e=>{e.preventDefault(); if(!confirm("Reset this client password? The current password will stop working.")) return; run(()=>resetClientPassword(clientId,password).then(()=>setPassword("")));}} className="flex gap-2">
      <input type="password" minLength={12} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password (12+)" className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5 text-sm" autoComplete="new-password" />
      <button disabled={busy} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200">Reset password</button>
    </form>
    {error && <span role="alert" className="text-xs text-red-300">{error}</span>}
  </div>;
}
