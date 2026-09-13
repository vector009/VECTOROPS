"use client";
import { useState } from "react";
import { validateConnection } from "@/lib/actions";
export function ConnectionVerifyButton({ connectionId }: { connectionId:string }) {
  const [busy,setBusy]=useState(false); const [error,setError]=useState<string|null>(null);
  async function run(){setBusy(true);setError(null);try{await validateConnection(connectionId);window.location.reload();}catch(e){setError(e instanceof Error?e.message:"Verification failed.");}finally{setBusy(false)}}
  return <span className="inline-flex items-center gap-2"><button type="button" disabled={busy} onClick={run} className="rounded-lg border border-white/8 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200">{busy?"Checking…":"Verify"}</button>{error&&<span role="alert" className="text-[11px] text-red-300">{error}</span>}</span>;
}
