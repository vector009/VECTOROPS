import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { AutomationControl } from "@/components/AutomationControl";
import { EmptyState } from "@/components/EmptyState";
import { formatDateTime } from "@/lib/utils";

export default async function AutomationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: workflow }, { data: logs }] = await Promise.all([
    supabase.from("workflows").select("id,client_id,connection_id,n8n_instance_id,n8n_workflow_id,workflow_name,business_name,business_job,description,status,client_visible,desired_state,actual_state,last_execution_at,last_success_at,last_failure_at,last_error,created_at,updated_at").eq("id", id).maybeSingle(),
    supabase.from("automation_logs").select("id,event_type,severity,occurred_at,success,duration_ms,error_code,error_message,client_visible").eq("workflow_id", id).order("occurred_at", { ascending:false }).limit(40),
  ]);
  if (!workflow) notFound();
  return <>
    <PageHeader eyebrow="Automation detail" title={workflow.business_name || workflow.workflow_name} description="Verified workflow identity and control state. VectorOps never exposes the n8n editor or secrets to clients." action={<Link href="/admin/automations" className="rounded-xl border border-white/8 px-4 py-2.5 text-sm text-slate-300">Back to automations</Link>} />
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="vx-surface rounded-2xl p-5 lg:col-span-2"><div className="vx-kicker">Business identity</div><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Business job", workflow.business_job || "—"], ["Status", workflow.status], ["Client visible", workflow.client_visible ? "Yes" : "No"], ["Last execution", formatDateTime(workflow.last_execution_at)], ["Last success", formatDateTime(workflow.last_success_at)], ["Last failure", formatDateTime(workflow.last_failure_at)]].map(([label,value])=><div key={label} className="vx-inset rounded-xl p-3"><div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-sm text-slate-200">{label==="Status"?<StatusBadge value={value}/>:value}</div></div>)}</div><p className="mt-4 text-sm leading-6 text-slate-400">{workflow.description || "No business description supplied."}</p></section>
      <section className="vx-surface rounded-2xl p-5"><div className="vx-kicker">Control plane</div><div className="mt-4 space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Desired</span><StatusBadge value={workflow.desired_state}/></div><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Actual</span><StatusBadge value={workflow.actual_state}/></div><div className="pt-2"><AutomationControl workflowId={workflow.id} actual={workflow.actual_state} desired={workflow.desired_state}/></div></div><div className="mt-5 border-t border-white/6 pt-4 text-xs leading-5 text-slate-500">Identity: {workflow.n8n_instance_id} / {workflow.n8n_workflow_id}</div></section>
    </div>
    <section className="mt-4 vx-surface rounded-2xl p-5"><div className="vx-kicker">Recorded execution activity</div>{logs?.length ? <div className="mt-4 divide-y divide-white/6">{logs.map((log:any)=><div key={log.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><div className="text-sm font-semibold text-slate-200">{log.event_type}</div><div className="text-xs text-slate-500">{formatDateTime(log.occurred_at)}{log.error_message?` · ${log.error_message}`:""}</div></div><StatusBadge value={log.severity}/><span className={log.success===false?"text-xs text-red-300":"text-xs text-emerald-300"}>{log.success===false?"Failed":"Recorded"}</span></div>)}</div> : <EmptyState title="No execution activity" description="No automation log records are currently associated with this workflow."/>}</section>
  </>;
}
